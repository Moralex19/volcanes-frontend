import { hasInjectionContext, getCurrentInstance, defineComponent, ref, inject, h, Suspense, Fragment, createApp, provide, shallowReactive, toRef, onErrorCaptured, onServerPrefetch, unref, createVNode, resolveDynamicComponent, reactive, effectScope, shallowRef, isReadonly, isRef, isShallow, isReactive, toRaw, defineAsyncComponent, mergeProps, getCurrentScope, computed, useSSRContext } from 'vue';
import { i as hasProtocol, k as isScriptProtocol, l as joinURL, w as withQuery, s as sanitizeStatusCode, m as getContext, $ as $fetch, n as createHooks, o as executeAsync, c as createError$1, t as toRouteMatcher, p as createRouter$1, q as defu } from '../nitro/nitro.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.19.0";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
const _routes = [
  {
    name: "index",
    path: "/",
    component: () => import('./index-JFl3RU8T.mjs')
  }
];
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      if (to.matched[to.matched.length - 1]?.components?.default === from.matched[from.matched.length - 1]?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    useError();
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0) {
        return nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4
];
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_0$1 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const logo = { "content": { "text": "Revista Volcanes y Raices" } };
const company = {
  logo
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$6 = {
  __name: "Header",
  __ssrInlineRender: true,
  props: { isScrolled: { type: Boolean, default: false } },
  setup(__props) {
    const titleText = computed(() => company?.logo?.content?.text);
    ref(null);
    const isOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({
        class: ["site-header", { scrolled: __props.isScrolled }]
      }, _attrs))} data-v-8acc69df><div class="topbar container-fluid" data-v-8acc69df><button class="toggler" type="button" aria-controls="navMobile"${ssrRenderAttr("aria-expanded", isOpen.value ? "true" : "false")} aria-label="Toggle navigation" data-v-8acc69df><span class="burger" data-v-8acc69df><i data-v-8acc69df></i><i data-v-8acc69df></i><i data-v-8acc69df></i></span></button><h1 class="brand text-uppercase m-0" data-v-8acc69df>${ssrInterpolate(titleText.value)}</h1><span class="spacer" data-v-8acc69df></span></div><div class="${ssrRenderClass([{ hidden: __props.isScrolled }, "nav-row d-none d-lg-block"])}" data-v-8acc69df><nav class="categories container" data-v-8acc69df><ul class="cat-list" data-v-8acc69df><li data-v-8acc69df><a href="#inicio" data-v-8acc69df>Inicio</a></li><li data-v-8acc69df><a href="#quienes-somos" data-v-8acc69df>Nosotros</a></li><li data-v-8acc69df><a href="#catalogo" data-v-8acc69df>Catálogo</a></li><li data-v-8acc69df><a href="#servicios" data-v-8acc69df>Secciones</a></li><li data-v-8acc69df><a href="#contacto" data-v-8acc69df>Contacto</a></li></ul></nav></div><div class="collapse" id="navMobile" data-v-8acc69df><nav class="mobile-menu container" data-v-8acc69df><ul class="cat-list" data-v-8acc69df><li data-v-8acc69df><a href="#inicio" data-v-8acc69df>Inicio</a></li><li data-v-8acc69df><a href="#quienes-somos" data-v-8acc69df>Nosotros</a></li><li data-v-8acc69df><a href="#catalogo" data-v-8acc69df>Catálogo</a></li><li data-v-8acc69df><a href="#servicios" data-v-8acc69df>Secciones</a></li><li data-v-8acc69df><a href="#contacto" data-v-8acc69df>Contacto</a></li></ul></nav></div></header>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-8acc69df"]]);
const _sfc_main$5 = {
  __name: "ModalTerms",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "modal fade",
        id: "termsModal",
        tabindex: "-1",
        "aria-labelledby": "termsModalLabel",
        "aria-hidden": "true"
      }, _attrs))} data-v-383d1026><div class="modal-dialog modal-dialog-centered modal-lg" data-v-383d1026><div class="modal-content" data-v-383d1026><div class="modal-header" data-v-383d1026><h5 class="modal-title" id="termsModalLabel" data-v-383d1026>Términos y Condiciones</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" data-v-383d1026></button></div><div class="modal-body" data-v-383d1026><h5 data-v-383d1026>TERMINOS Y CONDICIONES</h5><h6 data-v-383d1026>Última actualización: [Fecha]</h6><h6 data-v-383d1026>1. Aceptación de los Términos</h6><p data-v-383d1026> Al acceder y usar [Nombre del Sitio/Aplicación], aceptas cumplir con estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestro sitio/aplicación. </p><h6 data-v-383d1026>2. Modificaciones a los Términos</h6><p data-v-383d1026> Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones se publicarán en esta página y se considerarán efectivas desde el momento de su publicación. </p><h6 data-v-383d1026>3. Uso del Sitio/Aplicación</h6><p data-v-383d1026> Tienes permiso para usar nuestro sitio/aplicación solo para fines legales y de acuerdo con estos términos. No puedes usar el sitio para: </p><ul data-v-383d1026><li data-v-383d1026>Realizar actividades ilegales o fraudulentas.</li><li data-v-383d1026>Transmitir virus o cualquier código dañino.</li><li data-v-383d1026>Recolectar o almacenar información personal de otros usuarios sin su consentimiento.</li></ul><h6 data-v-383d1026>4. Propiedad Intelectual</h6><p data-v-383d1026> Todo el contenido del sitio/aplicación, incluidos pero no limitados a textos, gráficos, logos, y software, es propiedad de [Nombre de la Empresa] o de sus licenciantes y está protegido por leyes de propiedad intelectual. </p><h6 data-v-383d1026>5. Limitación de Responsabilidad</h6><p data-v-383d1026> No seremos responsables por daños directos, indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad de usar el sitio/aplicación, incluso si se nos ha informado de la posibilidad de tales daños. </p><h6 data-v-383d1026>6. Enlaces a Sitios de Terceros</h6><p data-v-383d1026> Nuestro sitio/aplicación puede contener enlaces a sitios web de terceros. No somos responsables del contenido ni de las prácticas de privacidad de esos sitios. </p><h6 data-v-383d1026>7. Ley Aplicable</h6><p data-v-383d1026> Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de [Jurisdicción]. </p><h6 data-v-383d1026>8. Contacto</h6><p data-v-383d1026> Si tienes alguna pregunta sobre estos Términos y Condiciones, por favor contáctanos en [Dirección de Correo Electrónico]. </p></div><div class="modal-footer" data-v-383d1026><button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-v-383d1026>Cerrar</button></div></div></div></div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ModalTerms.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-383d1026"]]);
const _sfc_main$4 = {
  __name: "ModalPrivacy",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "modal fade",
        id: "privacyModal",
        tabindex: "-1",
        "aria-labelledby": "privacyModalLabel",
        "aria-hidden": "true"
      }, _attrs))} data-v-8e7f88a6><div class="modal-dialog modal-dialog-centered modal-lg" data-v-8e7f88a6><div class="modal-content" data-v-8e7f88a6><div class="modal-header" data-v-8e7f88a6><h5 class="modal-title" id="privacyModalLabel" data-v-8e7f88a6>Aviso de Privacidad</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" data-v-8e7f88a6></button></div><div class="modal-body" data-v-8e7f88a6><h5 data-v-8e7f88a6>AVISO DE PRIVACIDAD</h5><h6 data-v-8e7f88a6>Última actualización: [Fecha]</h6><h6 data-v-8e7f88a6>1. Información Recopilada</h6><p data-v-8e7f88a6> Recopilamos la siguiente información de nuestros usuarios: </p><ul data-v-8e7f88a6><li data-v-8e7f88a6>Información personal proporcionada por el usuario.</li><li data-v-8e7f88a6>Datos de uso del sitio/aplicación.</li><li data-v-8e7f88a6>Información de contacto.</li></ul><h6 data-v-8e7f88a6>2. Uso de la Información</h6><p data-v-8e7f88a6> La información recopilada se utiliza para: </p><ul data-v-8e7f88a6><li data-v-8e7f88a6>Proporcionar y mejorar nuestros servicios.</li><li data-v-8e7f88a6>Contactar a los usuarios con actualizaciones y promociones.</li><li data-v-8e7f88a6>Responder a consultas y brindar soporte.</li></ul><h6 data-v-8e7f88a6>3. Seguridad</h6><p data-v-8e7f88a6> Tomamos medidas razonables para proteger la información personal de los usuarios. Sin embargo, no podemos garantizar la seguridad completa de la información transmitida a través de Internet. </p><h6 data-v-8e7f88a6>4. Derechos del Usuario</h6><p data-v-8e7f88a6> Los usuarios tienen derecho a acceder, corregir y eliminar su información personal. Para ejercer estos derechos, contáctanos en [Dirección de Correo Electrónico]. </p><h6 data-v-8e7f88a6>5. Cambios en el Aviso de Privacidad</h6><p data-v-8e7f88a6> Podemos actualizar este aviso de privacidad de vez en cuando. Las modificaciones se publicarán en esta página y serán efectivas desde el momento de su publicación. </p><h6 data-v-8e7f88a6>6. Contacto</h6><p data-v-8e7f88a6> Si tienes alguna pregunta sobre este aviso de privacidad, por favor contáctanos en [Dirección de Correo Electrónico]. </p></div><div class="modal-footer" data-v-8e7f88a6><button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-v-8e7f88a6>Cerrar</button></div></div></div></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ModalPrivacy.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-8e7f88a6"]]);
const footer = { "backgroundColor": "#192733", "textColor": "#ffffff", "linkColor": "#d1d1d1", "hoverLinkColor": "#ffffff", "borderColor": "rgba(255, 255, 255, 0.1)", "socialIconColor": { "email": "#6c759d", "facebook": "#4267b2", "instagram": "#c13584", "whatsapp": "#25d366" }, "derechos": "Torre Fuerte. Todos los derechos reservados.", "p1": "Es un taller especializado en trabajos de herrería en general.", "p2": "Dirección: Calle Taller 456, Ciudad de México, México", "p3": "Tel: +52 5551234567", "p4": "Mail: contacto@tallerespecializado.com", "¿QUÉ HACEMOS?": "¿QUÉ HACEMOS?", "l1": "Puertas y Portones", "l2": "Estructuras de metal", "l3": "Protecciones y barandales", "l4": "Trabajos en cristal", "l5": "Herrería artística y decorativa", "Terminos": "Términos y Condiciones", "Privacidad": "Aviso de Privacidad", "Redes": "SÍGUENOS EN REDES" };
const colors = {
  footer
};
const _sfc_main$3 = {
  components: {
    ModalTerms: __nuxt_component_0,
    ModalPrivacy: __nuxt_component_1
  },
  computed: {
    footerStyle() {
      return {
        backgroundColor: colors.footer.backgroundColor || "#2c3e50",
        color: colors.footer.textColor || "#ffffff",
        borderTop: `1px solid ${colors.footer.borderColor || "rgba(255, 255, 255, 0.1)"}`
      };
    },
    colors() {
      return colors;
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ModalTerms = __nuxt_component_0;
  const _component_ModalPrivacy = __nuxt_component_1;
  _push(`<footer${ssrRenderAttrs(mergeProps({
    class: "footer",
    style: $options.footerStyle
  }, _attrs))} data-v-83cc2e5b><div class="footer-section" data-v-83cc2e5b><h4 data-v-83cc2e5b>${ssrInterpolate($options.colors.footer["¿QUÉ HACEMOS?"])}</h4><ul class="footer-list" data-v-83cc2e5b><li data-v-83cc2e5b>${ssrInterpolate($options.colors.footer.l1)}</li><li data-v-83cc2e5b>${ssrInterpolate($options.colors.footer.l2)}</li><li data-v-83cc2e5b>${ssrInterpolate($options.colors.footer.l3)}</li><li data-v-83cc2e5b>${ssrInterpolate($options.colors.footer.l4)}</li><li data-v-83cc2e5b>${ssrInterpolate($options.colors.footer.l5)}</li></ul></div><div class="footer-section" data-v-83cc2e5b><h4 data-v-83cc2e5b>${ssrInterpolate($options.colors.footer.Redes)}</h4><div class="social-links" data-v-83cc2e5b><a href="mailto:example@example.com" target="_blank" rel="noopener noreferrer" aria-label="Correo Electrónico" data-v-83cc2e5b><i class="fa-solid fa-envelope social-icon" style="${ssrRenderStyle({ color: $options.colors.footer.socialIconColor.email })}" data-v-83cc2e5b></i></a><a href="https://www.facebook.com/profile.php?id=100072182591117" target="_blank" rel="noopener noreferrer" aria-label="Facebook" data-v-83cc2e5b><i class="fa-brands fa-facebook social-icon" style="${ssrRenderStyle({ color: $options.colors.footer.socialIconColor.facebook })}" data-v-83cc2e5b></i></a><a href="https://instagram.com/tuperfil" target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-v-83cc2e5b><i class="fa-brands fa-instagram social-icon" style="${ssrRenderStyle({ color: $options.colors.footer.socialIconColor.instagram })}" data-v-83cc2e5b></i></a><a href="https://wa.me/9624002136" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" data-v-83cc2e5b><i class="fa-brands fa-whatsapp social-icon" style="${ssrRenderStyle({ color: $options.colors.footer.socialIconColor.whatsapp })}" data-v-83cc2e5b></i></a></div></div><div class="footer-section" data-v-83cc2e5b><p data-v-83cc2e5b>${ssrInterpolate($options.colors.footer.p1)}</p><p data-v-83cc2e5b>${ssrInterpolate($options.colors.footer.p2)}</p><p data-v-83cc2e5b>${ssrInterpolate($options.colors.footer.p3)}</p><p data-v-83cc2e5b>${ssrInterpolate($options.colors.footer.p4)}</p></div><p class="footer-links" data-v-83cc2e5b><a href="#" data-bs-toggle="modal" data-bs-target="#termsModal" data-v-83cc2e5b>${ssrInterpolate($options.colors.footer.Terminos)}</a> | <a href="#" data-bs-toggle="modal" data-bs-target="#privacyModal" data-v-83cc2e5b>${ssrInterpolate($options.colors.footer.Privacidad)}</a></p>`);
  _push(ssrRenderComponent(_component_ModalTerms, null, null, _parent));
  _push(ssrRenderComponent(_component_ModalPrivacy, null, null, _parent));
  _push(`<p class="footer-copyright" data-v-83cc2e5b> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} ${ssrInterpolate($options.colors.footer.derechos)}</p></footer>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-83cc2e5b"]]);
const _sfc_main$2 = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const isScrolled = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "app" }, _attrs))}>`);
      _push(ssrRenderComponent(Header, { isScrolled: isScrolled.value }, null, _parent));
      _push(`<main class="page">`);
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-CcgNj6_f.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-OnOrB9zn.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { _export_sfc as _, useNuxtApp as a, useRuntimeConfig as b, nuxtLinkDefaults as c, entry$1 as default, navigateTo as n, resolveRouteObject as r, tryUseNuxtApp as t, useRouter as u };
//# sourceMappingURL=server.mjs.map

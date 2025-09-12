import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { SwiperSlide, Swiper } from 'swiper/vue';
import { EffectCube, Autoplay } from 'swiper/modules';
import { ref, mergeProps, resolveComponent, withCtx, createVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, computed, unref, useSSRContext } from 'vue';
import { _ as _export_sfc } from './server.mjs';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { u as useHead } from './v3-CL5bmvNj.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-router';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main$5 = {
  components: {
    Swiper,
    SwiperSlide
  },
  setup() {
    return {
      modules: [EffectCube, Autoplay],
      slides: [
        {
          imageSrc: "/imagen1.png",
          title: "\xA1Innova tu hogar con puertas y portones modernos!",
          description: "Transforma la entrada de tu casa o negocio con dise\xF1os de puertas y portones \xFAnicos."
        },
        {
          imageSrc: "/imagen2.png",
          title: "\xA1Protecciones y barandales que fusionan seguridad y dise\xF1o!",
          description: "Nuestros barandales y protecciones ofrecen la m\xE1xima seguridad. Crea espacios que te brinden tranquilidad y elegancia al mismo tiempo."
        },
        {
          imageSrc: "/imagen3.jpeg",
          title: "\xA1Espacios llenos de luz con nuestras soluciones en cristal!",
          description: "Aporta modernidad y amplitud a tus espacios con trabajos en cristal que resaltan la belleza y luminosidad de cualquier \xE1rea."
        },
        {
          imageSrc: "/imagen4.jpg",
          title: "\xA1Herrer\xEDa art\xEDstica para personalizar cada rinc\xF3n!",
          description: "Dale un toque personalizado a tu hogar con nuestras piezas de herrer\xEDa art\xEDstica."
        }
      ]
    };
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_swiper = resolveComponent("swiper");
  const _component_swiper_slide = resolveComponent("swiper-slide");
  _push(ssrRenderComponent(_component_swiper, mergeProps({
    effect: "cube",
    cubeEffect: { slideShadows: true, shadowOffset: 20, shadowScale: 0.94 },
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 5e3,
      // Cambia el delay para ajustar el tiempo entre diapositivas
      disableOnInteraction: false
    },
    speed: 4e3,
    modules: $setup.modules,
    class: "mySwiper"
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<!--[-->`);
        ssrRenderList($setup.slides, (slide, index2) => {
          _push2(ssrRenderComponent(_component_swiper_slide, { key: index2 }, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<div class="slide-content" data-v-84f22b39${_scopeId2}><img class="slide-image"${ssrRenderAttr("src", slide.imageSrc)} alt="Imagen del slide" data-v-84f22b39${_scopeId2}><div class="slide-caption" data-v-84f22b39${_scopeId2}><h2 class="slide-title" data-v-84f22b39${_scopeId2}>${ssrInterpolate(slide.title)}</h2><p class="slide-description" data-v-84f22b39${_scopeId2}>${ssrInterpolate(slide.description)}</p></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "slide-content" }, [
                    createVNode("img", {
                      class: "slide-image",
                      src: slide.imageSrc,
                      alt: "Imagen del slide"
                    }, null, 8, ["src"]),
                    createVNode("div", { class: "slide-caption" }, [
                      createVNode("h2", { class: "slide-title" }, toDisplayString(slide.title), 1),
                      createVNode("p", { class: "slide-description" }, toDisplayString(slide.description), 1)
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
        });
        _push2(`<!--]-->`);
      } else {
        return [
          (openBlock(true), createBlock(Fragment, null, renderList($setup.slides, (slide, index2) => {
            return openBlock(), createBlock(_component_swiper_slide, { key: index2 }, {
              default: withCtx(() => [
                createVNode("div", { class: "slide-content" }, [
                  createVNode("img", {
                    class: "slide-image",
                    src: slide.imageSrc,
                    alt: "Imagen del slide"
                  }, null, 8, ["src"]),
                  createVNode("div", { class: "slide-caption" }, [
                    createVNode("h2", { class: "slide-title" }, toDisplayString(slide.title), 1),
                    createVNode("p", { class: "slide-description" }, toDisplayString(slide.description), 1)
                  ])
                ])
              ]),
              _: 2
            }, 1024);
          }), 128))
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeroSlideshow.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const HeroSlideshow = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-84f22b39"]]);
const description = "Es un taller especializado en trabajos de puertas, portones, ventanas, protecciones, barandales, forja, estructura, cristal, trabajos especiales, herrer\xEDa art\xEDstica y herrer\xEDa en general. Todos nuestros trabajos son elaborados con los mejores materiales y herramientas de la mejor calidad, y siempre hacemos acabados profesionales.";
const features = [{ "icon": "fas fa-door-open", "title": "Trabajos Especializados", "description": "Nos especializamos en la creaci\xF3n de puertas, ventanas, portones y m\xE1s, asegurando que se adapten perfectamente a tus necesidades.", "iconColor": "#4d1bc9" }, { "icon": "fas fa-tools", "title": "Calidad en Materiales", "description": "Utilizamos solo los mejores materiales y herramientas para asegurar la durabilidad y resistencia de nuestros productos.", "iconColor": "#25d366" }, { "icon": "fas fa-palette", "title": "Herrer\xEDa Art\xEDstica", "description": "Contamos con dise\xF1os personalizados y trabajos en forja para lograr acabados \xFAnicos y elegantes.", "iconColor": "#c13584" }];
const additionalInfo = "Para nosotros lo m\xE1s importante es que recibas un servicio de calidad, y que cumpla con tus gustos y necesidades. Ofrecemos asesor\xEDa personalizada y nos encargamos de tomar las medidas y comprender el dise\xF1o que requieras, antes de hacer cotizaciones preliminares.";
const history = "Est\xE1 conformada por diferentes talleres que fueron desarrollados conforme al crecimiento de la familia.";
const data = {
  description,
  features,
  additionalInfo,
  history
};
const _imports_0 = publicAssetsURL("/logo.png");
const _sfc_main$4 = {
  name: "WhoAreWe",
  data() {
    return {
      data
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "whoarewe-container" }, _attrs))}><div class="image-content-wrapper"><div class="image-section"><img${ssrRenderAttr("src", _imports_0)} alt="Logo"></div><div class="content-section"><h1 class="section-title">Nosotros!!</h1><p class="section-description">${ssrInterpolate($data.data.description)}</p></div></div><div class="features"><!--[-->`);
  ssrRenderList($data.data.features, (feature, index2) => {
    _push(`<div class="feature"><i class="${ssrRenderClass([feature.icon, "social-icon"])}" style="${ssrRenderStyle({ color: feature.iconColor })}"></i><div class="feature-text"><h2>${ssrInterpolate(feature.title)}</h2><p>${ssrInterpolate(feature.description)}</p></div></div>`);
  });
  _push(`<!--]--></div></div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/WhoAreWe.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const WhoAreWe = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$3 = {
  __name: "Card",
  __ssrInlineRender: true,
  props: {
    service: { type: Object, required: true }
  },
  setup(__props) {
    const ver = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col" }, _attrs))} data-v-abf77cd3><div class="card" data-v-abf77cd3><img${ssrRenderAttr("src", `/myservices/imgServices/${__props.service.image}`)} class="card-img-top"${ssrRenderAttr("alt", __props.service.title)} data-v-abf77cd3><div class="card-body" data-v-abf77cd3><h5 class="card-title text-center mb-2" data-v-abf77cd3>${ssrInterpolate(__props.service.title)}</h5><hr data-v-abf77cd3>`);
      if (ver.value) {
        _push(`<p class="card-text" data-v-abf77cd3>${ssrInterpolate(__props.service.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="d-flex justify-content-around wb-5" data-v-abf77cd3><button class="btn btn-primary my-3" data-v-abf77cd3>${ssrInterpolate(ver.value ? "Ocultar" : "Ver")}</button></div></div></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Card.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Card = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-abf77cd3"]]);
const _sfc_main$2 = {
  __name: "Services",
  __ssrInlineRender: true,
  setup(__props) {
    const services = ref([]);
    const pageTitle = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "container-principal" }, _attrs))}><div class="py-5"><h1 class="text-center">${ssrInterpolate(pageTitle.value)}</h1><div class="row g-5 py-5 px-1 justify-content-center row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3"><!--[-->`);
      ssrRenderList(services.value, (s, i) => {
        _push(ssrRenderComponent(Card, {
          key: `${s.title}-${i}`,
          service: s
        }, null, _parent));
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Services.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const tittle = "Contactanos";
const subtitulo = "\xBFCom\xF3 podemos ayudarte?";
const p1 = "\xBFNecesitas hablar con nosotros?";
const direccion = "Tapachula, Chiapas 30700";
const celphone = "+52 (962) 234-5678";
const correo = "torrefuerte.oficial@example.com";
const contacto = {
  tittle,
  subtitulo,
  p1,
  direccion,
  celphone,
  correo
};
const _sfc_main$1 = {
  __name: "ContactZone",
  __ssrInlineRender: true,
  setup(__props) {
    const form = ref({
      nombre: "",
      email: "",
      telefono: "",
      mensaje: ""
    });
    const loading = ref(false);
    ref(null);
    computed(() => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(form.value.email);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mt-5" }, _attrs))} data-v-217e7855><div class="row" data-v-217e7855><div class="col-md-6 animate-on-scroll" data-v-217e7855><div class="bg-light p-4 rounded shadow-sm contact-info h-100 d-flex flex-column justify-content-center align-items-center" data-v-217e7855><h2 class="" data-v-217e7855>${ssrInterpolate(unref(contacto).tittle)}</h2><h3 data-v-217e7855>${ssrInterpolate(unref(contacto).subtitulo)}</h3><p data-v-217e7855>${ssrInterpolate(unref(contacto).p1)}</p><p data-v-217e7855><i class="fa-solid fa-map-pin" data-v-217e7855></i> ${ssrInterpolate(unref(contacto).direccion)}</p><p data-v-217e7855><i class="fa-solid fa-phone-volume" data-v-217e7855></i> ${ssrInterpolate(unref(contacto).celphone)}</p><p data-v-217e7855><i class="fa-solid fa-at" data-v-217e7855></i> ${ssrInterpolate(unref(contacto).correo)}</p></div></div><div class="col-md-6 animate-on-scroll" data-v-217e7855><form class="contact-form bg-light p-4 rounded shadow-sm" data-v-217e7855><div class="mb-3 animate-on-scroll" data-v-217e7855><label for="nombre" class="form-label" data-v-217e7855>Nombre</label><div class="input-group" data-v-217e7855><span class="input-group-text" data-v-217e7855><i class="fa-solid fa-user-astronaut" data-v-217e7855></i></span><input type="text" id="nombre"${ssrRenderAttr("value", form.value.nombre)} class="form-control" required data-v-217e7855></div></div><div class="mb-3 animate-on-scroll" data-v-217e7855><label for="email" class="form-label" data-v-217e7855>Email</label><div class="input-group" data-v-217e7855><span class="input-group-text" data-v-217e7855><i class="fa-solid fa-envelope" data-v-217e7855></i></span><input type="email" id="email"${ssrRenderAttr("value", form.value.email)} class="form-control" required data-v-217e7855></div></div><div class="mb-3 animate-on-scroll" data-v-217e7855><label for="telefono" class="form-label" data-v-217e7855>N\xFAmero de tel\xE9fono</label><div class="input-group" data-v-217e7855><span class="input-group-text" data-v-217e7855><i class="fa-solid fa-square-phone-flip" data-v-217e7855></i></span><input type="tel" id="telefono"${ssrRenderAttr("value", form.value.telefono)} class="form-control" required data-v-217e7855></div></div><div class="mb-3 animate-on-scroll" data-v-217e7855><label for="mensaje" class="form-label" data-v-217e7855>Mensaje</label><div class="input-group" data-v-217e7855><span class="input-group-text" data-v-217e7855><i class="fa-regular fa-comment" data-v-217e7855></i></span><textarea id="mensaje" class="form-control" required data-v-217e7855>${ssrInterpolate(form.value.mensaje)}</textarea></div></div><div class="d-flex justify-content-center align-items-center animate-on-scroll" data-v-217e7855>`);
      if (!loading.value) {
        _push(`<button type="submit" class="btn btn-primary m-0" data-v-217e7855> Enviar <i class="fa-solid fa-paper-plane btn-icon ms-2" data-v-217e7855></i></button>`);
      } else {
        _push(`<div class="spinner-border" role="status" data-v-217e7855><span class="visually-hidden" data-v-217e7855>Loading...</span></div>`);
      }
      _push(`</div></form></div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ContactZone.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ContactZone = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-217e7855"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Volcanes y Raices" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-943cd4f0><section id="inicio" class="bg-dark text-white text-center d-flex align-items-center justify-content-center position-relative" style="${ssrRenderStyle({ "min-height": "calc(100vh - var(--header-h))" })}" data-v-943cd4f0>`);
      _push(ssrRenderComponent(HeroSlideshow, null, null, _parent));
      _push(`</section><section id="quienes-somos" class="py-5 bg-light section-anchor" data-v-943cd4f0>`);
      _push(ssrRenderComponent(WhoAreWe, null, null, _parent));
      _push(`</section><section id="catalogo" class="py-5 bg-white section-anchor" data-v-943cd4f0><div class="container" data-v-943cd4f0><h2 class="mb-4 text-center" data-v-943cd4f0>El Principito</h2><div class="ratio ratio-16x9" data-v-943cd4f0><iframe src="https://e.issuu.com/embed.html?d=el_principito_edincr&amp;u=volcanesyraices" style="${ssrRenderStyle({ "border": "0" })}" allowfullscreen title="El Principito" data-v-943cd4f0></iframe></div></div></section><section id="servicios" class="py-5 bg-light section-anchor" data-v-943cd4f0>`);
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(`</section><section id="contacto" class="py-5 section-anchor" data-v-943cd4f0>`);
      _push(ssrRenderComponent(ContactZone, null, null, _parent));
      _push(`</section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-943cd4f0"]]);

export { index as default };
//# sourceMappingURL=index-JFl3RU8T.mjs.map

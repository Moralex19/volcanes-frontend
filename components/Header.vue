<template>
  <header class="site-header" :class="{ scrolled: isScrolled }">
    <!-- Barra roja superior -->
    <div class="topbar container-fluid">
      <button
        class="toggler"
        type="button"
        aria-controls="navMobile"
        :aria-expanded="isOpen ? 'true' : 'false'"
        aria-label="Toggle navigation"
        @click="toggleMenu"
      >
        <span class="burger"><i></i><i></i><i></i></span>
      </button>

      <h1 class="brand text-uppercase m-0">{{ titleText }}</h1>
      <span class="spacer"></span>
    </div>

    <!-- Fila de categorías (desktop). Se oculta en scroll -->
    <div class="nav-row d-none d-lg-block" :class="{ hidden: isScrolled }">
      <nav class="categories container">
        <ul class="cat-list">
          <li><NuxtLink :to="{ path: '/' }">Inicio</NuxtLink></li>
          <li><NuxtLink :to="{ path: '/', hash: '#quienes-somos' }">Nosotros</NuxtLink></li>
          <li><NuxtLink :to="{ path: '/', hash: '#catalogo' }">Catálogo</NuxtLink></li>
          <li><NuxtLink :to="{ path: '/', hash: '#servicios' }">Secciones</NuxtLink></li>
          <li><NuxtLink :to="{ path: '/', hash: '#contacto' }">Contacto</NuxtLink></li>
        </ul>
      </nav>
    </div>

    <!-- Menú colapsable (móvil siempre; desktop cuando hay scroll) -->
    <div class="collapse" id="navMobile" ref="collapseEl">
      <nav class="mobile-menu container">
        <ul class="cat-list">
          <li><NuxtLink :to="{ path: '/' }" @click="onNavClick">Inicio</NuxtLink></li>
          <li><NuxtLink :to="{ path: '/', hash: '#quienes-somos' }" @click="onNavClick">Nosotros</NuxtLink></li>
          <li><NuxtLink :to="{ path: '/', hash: '#catalogo' }" @click="onNavClick">Catálogo</NuxtLink></li>
          <li><NuxtLink :to="{ path: '/', hash: '#servicios' }" @click="onNavClick">Secciones</NuxtLink></li>
          <li><NuxtLink :to="{ path: '/', hash: '#contacto' }" @click="onNavClick">Contacto</NuxtLink></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRouter } from '#app'
import company from '~/assets/data/header.json'

const props = defineProps({ isScrolled: { type: Boolean, default: false } })
const titleText = computed(() => company?.logo?.content?.text || 'EXPANSIÓN')

const collapseEl = ref(null)
let bsCollapse = null
const isOpen = ref(false)

const toggleMenu = () => {
  if (!bsCollapse) return
  bsCollapse.toggle()
  isOpen.value = !isOpen.value
}
const closeMenu = () => {
  if (!bsCollapse) return
  bsCollapse.hide()
  isOpen.value = false
}
const onNavClick = () => closeMenu()
const onEscape = (e) => { if (e.key === 'Escape') closeMenu() }

const router = useRouter()
// Cierra el menú cuando cambia la ruta (útil en móvil)
watch(() => router.currentRoute.value.fullPath, () => closeMenu())

onMounted(async () => {
  const bs = await import('bootstrap/dist/js/bootstrap.esm.js')
  const { Collapse } = bs
  if (collapseEl.value) {
    bsCollapse = new Collapse(collapseEl.value, { toggle: false })
  }
  window.addEventListener('keydown', onEscape)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onEscape)
  bsCollapse = null
})
</script>

<style scoped>

.site-header { 
  position: fixed; 
  top: 0; left: 0; right: 0; z-index: 1000; box-shadow: 0 2px 0 rgba(0,0,0,.05); }
.topbar { display: grid; grid-template-columns: auto 1fr auto; align-items: center; height: 72px; background: #727d94; color: #fff; padding: 0 16px; }
.brand { text-align: center; color: #fff; font-weight: 800; letter-spacing: 2px; font-size: clamp(20px, 3.4vw, 40px); }
.spacer { width: 32px; }

/* Hamburguesa */
.toggler { border: 0; background: transparent; width: 46px; height: 38px; display: inline-flex; align-items: center; justify-content: center; }
.toggler:focus { outline: none; box-shadow: none; }
.burger { display: inline-block; width: 24px; height: 18px; position: relative; }
.burger i { position: absolute; left: 0; right: 0; height: 2px; background: #fff; border-radius: 1px; }
.burger i:nth-child(1){ top: 0; } .burger i:nth-child(2){ top: 8px; } .burger i:nth-child(3){ bottom: 0; }

/* Barra categorías (desktop) */
.nav-row { background: #222; }
.nav-row.hidden { display: none; }
.categories { height: 48px; display: flex; align-items: center; }
.categories .cat-list { list-style: none; margin: 0; padding: 0; display: flex; gap: clamp(12px, 2.8vw, 48px); }
.categories .cat-list a { color: #fff; text-decoration: none; font-size: 18px; line-height: 48px; display: inline-block; padding: 0 2px; transition: color .2s ease; }
.categories .cat-list a:hover { color: #ffd2d4; }

/* Menú colapsable */
.mobile-menu { background: #111; padding: 8px 0 14px; }
.mobile-menu .cat-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.mobile-menu .cat-list a { color: #fff; text-decoration: none; padding: 10px 4px; border-bottom: 1px solid rgba(255,255,255,.08); }

/* Responsive */
@media (min-width: 992px) {
  .toggler { display: none; }
  .site-header.scrolled .toggler { display: inline-flex; }
}
@media (max-width: 991.98px) {
  .nav-row { display: none !important; }
}
.site-header.scrolled .topbar { height: 64px; }
</style>

<!-- Ajustes globales recomendados -->
<style>
html { scroll-behavior: smooth; }
[id] { scroll-margin-top: 88px; }
@media (min-width: 992px) {
  [id] { scroll-margin-top: 120px; }
}
</style>

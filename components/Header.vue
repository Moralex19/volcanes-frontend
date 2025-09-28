<template>
  <header class="site-header" :class="{ scrolled: isScrolled }">
    <!-- Topbar -->
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

      <!-- BRAND centrado con fuentes específicas -->
      <div class="brand">
        <div class="brand-top">
          <span class="brand-r">R</span><span class="brand-evista">EVISTA</span>
        </div>
        <div class="brand-bottom">
          Volcanes y <span class="brand-r2">R</span>aíces
        </div>
      </div>

      <!-- Espaciador simétrico al ancho del botón -->
      <span class="spacer"></span>
    </div>

    <!-- Barra de categorías (desktop) centrada -->
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

    <!-- Menú colapsable (móvil) -->
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

<style src="../assets/styles/header.css"></style>

<style>
html { scroll-behavior: smooth; }
</style>
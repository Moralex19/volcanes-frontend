<template>
  <div class="app">
    <Header :isScrolled="isScrolled" />
    <main class="page">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const isScrolled = ref(false)
const handleScroll = () => { isScrolled.value = window.scrollY > 50 }

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style>
:root {
  --header-h: 80px;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page {
  flex: 1 1 auto;
  padding-top: var(--header-h);
}

html {
  scroll-behavior: smooth;
}
</style>

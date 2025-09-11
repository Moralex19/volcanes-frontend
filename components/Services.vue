<script setup>
import Card from './Card.vue'
import { ref, onMounted } from 'vue'

const services = ref([])
const pageTitle = ref('')

// nuevo nombre para evitar el viejo en caché
const DATA_URL = '/data/services.v2.json'

onMounted(async () => {
  const res = await fetch(`${DATA_URL}?v=${Date.now()}`, { cache: 'no-store' })
  const data = await res.json()
  services.value = data?.balconeriaServices ?? []
  pageTitle.value = data?.title ?? 'Servicios'
})
</script>

<template>
  <section class="container-principal">
    <div class="py-5">
      <h1 class="text-center">{{ pageTitle }}</h1>
      <div
        class="row g-5 py-5 px-1 justify-content-center
               row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3"
      >
        <Card v-for="(s, i) in services" :key="`${s.title}-${i}`" :service="s" />
      </div>
    </div>
  </section>
</template>

<style src="@/assets/styles/services.css"></style>

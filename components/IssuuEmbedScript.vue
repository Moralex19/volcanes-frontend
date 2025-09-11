<template>
  <div>
    <h2 v-if="title" class="mb-3">{{ title }}</h2>
    <ClientOnly>
      <div
        class="issuuembed"
        :data-configid="configId"
        style="width: 100%; height: 720px;"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  configId: { type: String, required: true }, // Lo copias de Issuu
  title:    { type: String, default: '' }
})

onMounted(() => {
  // Carga el script una sola vez
  if (!document.querySelector('script[src*="e.issuu.com/embed.js"]')) {
    const s = document.createElement('script')
    s.src = 'https://e.issuu.com/embed.js'
    s.async = true
    document.body.appendChild(s)
  }
})
</script>

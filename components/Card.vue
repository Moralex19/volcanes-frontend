<script setup>
import { ref } from 'vue'

defineProps({
  service: { type: Object, required: true }
})

const ver = ref(false)
const verDesc = () => { ver.value = !ver.value }
</script>

<template>
  <div class="col">
    <div class="card">
      <img :src="`/myservices/imgServices/${service.image}`"
           class="card-img-top"
           :alt="service.title" />

      <div class="card-body">
        <!-- 👇 centrado -->
        <h5 class="card-title text-center mb-2">{{ service.title }}</h5>
        <hr>
        <p v-if="ver" class="card-text">{{ service.description }}</p>
      </div>

      <div class="d-flex justify-content-around wb-5">
        <button class="btn btn-primary my-3" @click="verDesc">
          {{ ver ? 'Ocultar' : 'Ver' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style src="../assets/styles/card.css"></style>
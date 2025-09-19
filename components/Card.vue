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

<style scoped>
.card {
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
  font-family: inherit; /* 👉 hereda Arial desde global.css */
}

.card-img-top {
  border-radius: 50px;
  padding: 20px;
  object-fit: cover;
  height: 350px;
}

.card-body {
  padding: 25px;
  margin-top: -15px;
}

/* Botón azul sólido con letras blancas */
.btn-primary {
  background-color: #0000FF; /* azul */
  color: #FFFFFF;            /* blanco */
  border-radius: 50px;
  width: 120px;
  border: none;
  padding: 8px 16px;
}

.btn-primary:hover {
  background-color: #0044cc; /* azul más oscuro */
}
</style>

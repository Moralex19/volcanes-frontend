<!-- components/ContactZone.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { alertaExito, showAlertEmail } from '@/utils/alertas'
import colors from '~/assets/data/colors.json'
import contacto from '~/assets/data/contacto.json'

// Lee la base de la API desde runtimeConfig (PUBLIC_API_BASE en Netlify)
const { public: { apiBase } } = useRuntimeConfig()

const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  mensaje: ''
})

const limpiarDatos = () => {
  form.value = { nombre: '', email: '', telefono: '', mensaje: '' }
}

const loading = ref(false)
const emailInput = ref<HTMLInputElement | null>(null)

const isEmailValid = computed(() => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(form.value.email)
})

const focusEmailInput = () => { emailInput.value?.focus() }

const submitForm = async () => {
  if (!isEmailValid.value) {
    showAlertEmail()
    focusEmailInput()
    return
  }

  loading.value = true
  try {
    const res = await $fetch<{ ok: boolean }>(`${apiBase}/api/contact`, {
      method: 'POST',
      body: {
        nombre: form.value.nombre,
        email: form.value.email,
        telefono: form.value.telefono,
        mensaje: form.value.mensaje
      }
    })

    if (res?.ok) {
      limpiarDatos()
      alertaExito()
    } else {
      throw new Error('Respuesta no válida')
    }
  } catch (e) {
    console.error(e)
    alert('No se pudo enviar el mensaje. Intenta de nuevo.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Animación aparición
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting)
      })
    },
    { threshold: 0.1 }
  )
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))

  // Variables de color desde el JSON
  const root = document.documentElement
  root.style.setProperty('--contact-container-gradient1', colors.zoneContact['contact-container-backgroundColor-gradient1'])
  root.style.setProperty('--contact-container-gradient2', colors.zoneContact['contact-container-backgroundColor-gradient2'])
  root.style.setProperty('--text-principal-color', colors.zoneContact['textPrincipal'])
  root.style.setProperty('--text-p', colors.zoneContact['texto-p'])
  root.style.setProperty('--gradient1', colors.zoneContact['gradient1'])
  root.style.setProperty('--gradient2', colors.zoneContact['gradient2'])
})
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <!-- Info -->
      <div class="col-md-6 animate-on-scroll">
        <div class="p-4 rounded shadow-sm contact-info h-100 d-flex flex-column justify-content-center align-items-center">
          <h2>{{ contacto.tittle }}</h2>
          <h3>{{ contacto.subtitulo }}</h3>
          <p>{{ contacto.p1 }}</p>
          <p><i class="fa-solid fa-map-pin"></i> {{ contacto.direccion }}</p>
          <p><i class="fa-solid fa-phone-volume"></i> {{ contacto.celphone }}</p>
          <p><i class="fa-solid fa-at"></i> {{ contacto.correo }}</p>
        </div>
      </div>

      <!-- Formulario -->
      <div class="col-md-6 animate-on-scroll">
        <form @submit.prevent="submitForm" class="contact-form p-4 rounded shadow-sm">
          <div class="mb-3 animate-on-scroll">
            <label for="nombre" class="form-label">Nombre</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fa-solid fa-user-astronaut"></i></span>
              <input type="text" id="nombre" v-model="form.nombre" class="form-control" required />
            </div>
          </div>

          <div class="mb-3 animate-on-scroll">
            <label for="email" class="form-label">Email</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
              <input type="email" id="email" v-model="form.email" ref="emailInput" class="form-control" required />
            </div>
          </div>

          <div class="mb-3 animate-on-scroll">
            <label for="telefono" class="form-label">Número de teléfono</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fa-solid fa-square-phone-flip"></i></span>
              <input type="tel" id="telefono" v-model="form.telefono" class="form-control" required />
            </div>
          </div>

          <div class="mb-3 animate-on-scroll">
            <label for="mensaje" class="form-label">Mensaje</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fa-regular fa-comment"></i></span>
              <textarea id="mensaje" v-model="form.mensaje" class="form-control" required></textarea>
            </div>
          </div>

          <div class="d-flex justify-content-center align-items-center animate-on-scroll">
            <button v-if="!loading" type="submit" class="btn btn-primary m-0">
              Enviar <i class="fa-solid fa-paper-plane btn-icon ms-2"></i>
            </button>
            <div v-else class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');

.container{
  font-family: inherit;
  min-height: 100vh;
}

/* Fondos y texto */
.contact-info {
  background: linear-gradient(to right, var(--gradient1), var(--gradient2));
  color: var(--text-principal-color);
}
.contact-info h2 { color: var(--contact-container-gradient1); }

.contact-form {
  background: linear-gradient(to right, var(--gradient1), var(--gradient2));
  color: var(--text-principal-color);
}

/* Botón: azul sólido + letras blancas */
.btn-primary{
  background-color: #0000FF;
  color: #FFFFFF;
  border: none;
  border-radius: 10px;
  padding: 10px 25px;
}
.btn-primary:hover { background-color: #0044cc; }

.btn-icon { margin-left: 8px; }
.spinner-border { color: var(--text-p); }

@media (max-width: 768px) {
  .contact-info, .contact-form { width: 100%; }
}

/* Inputs */
.form-control:focus {
  border-color: var(--text-principal);
  box-shadow: 0 0 0 0.2rem rgba(var(--text-principal), 0.25);
}

/* Animación */
.contact-form .input-group { margin-bottom: 1rem; }
.animate-on-scroll { opacity: 0; transform: translateY(20px); transition: opacity .5s ease, transform .5s ease; }
.animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
.col-md-6:nth-child(1) { transition-delay: .1s; }
.col-md-6:nth-child(2) { transition-delay: .2s; }
.mb-3:nth-child(1) { transition-delay: .3s; }
.mb-3:nth-child(2) { transition-delay: .4s; }
.mb-3:nth-child(3) { transition-delay: .5s; }
.mb-3:nth-child(4) { transition-delay: .6s; }
.d-flex.justify-content-center { transition-delay: .7s; }
</style>

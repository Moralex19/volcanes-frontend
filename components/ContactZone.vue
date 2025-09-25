<!-- components/ContactZone.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { alertaExito, showAlertEmail } from '@/utils/alertas'
import colors from '~/assets/data/colors.json'
import contacto from '~/assets/data/contacto.json'

const { public: { apiBase: _apiBase, simulateContact, simulateDelayMs } } = useRuntimeConfig()
const apiBase = (_apiBase || '').replace(/\/+$/, '')

const form = ref({ nombre: '', email: '', telefono: '', mensaje: '' })
const loading = ref(false)
const emailInput = ref<HTMLInputElement | null>(null)
const generalError = ref<string | null>(null)

const limpiarDatos = () => {
  form.value = { nombre: '', email: '', telefono: '', mensaje: '' }
  generalError.value = null
}

const isEmailValid = computed(() =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.value.email)
)
const isFormValid = computed(() =>
  isEmailValid.value && !!form.value.nombre.trim() && !!form.value.mensaje.trim()
)

const focusEmailInput = () => emailInput.value?.focus()
const sleep = (ms:number) => new Promise(r => setTimeout(r, ms))

const submitForm = async () => {
  generalError.value = null

  if (!isEmailValid.value) {
    showAlertEmail()
    focusEmailInput()
    return
  }

  // === MODO SIMULACIÓN ===
  if (simulateContact) {
    loading.value = true
    try {
      console.group('[Contact simulate]')
      console.table(form.value)
      await sleep(simulateDelayMs || 600)
      console.groupEnd()
      limpiarDatos()
      alertaExito() // feedback visual de éxito
    } catch (e:any) {
      console.error('[contact simulate] error:', e)
      generalError.value = 'No se pudo simular el envío.'
    } finally {
      loading.value = false
    }
    return
  }

  // === MODO REAL (llama al backend) ===
  if (!apiBase) {
    generalError.value = 'No se configuró la URL de la API. Define PUBLIC_API_BASE en Vercel.'
    return
  }

  loading.value = true
  try {
    const res = await $fetch<{ ok: boolean; error?: string }>(`${apiBase}/api/contact`, {
      method: 'POST',
      body: { ...form.value },
      timeout: 15000
    })
    if (res?.ok) {
      limpiarDatos()
      alertaExito()
    } else {
      throw new Error(res?.error || 'Respuesta no válida del servidor')
    }
  } catch (e:any) {
    console.error('[contact] error:', e)
    generalError.value = e?.message || 'No se pudo enviar el mensaje. Intenta de nuevo más tarde.'
    alert('No se pudo enviar el mensaje. Intenta de nuevo.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry =>
      entry.target.classList.toggle('is-visible', entry.isIntersecting)
    ),
    { threshold: 0.1 }
  )
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))

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
        <div
          class="p-4 rounded shadow-sm contact-info h-100 d-flex flex-column justify-content-center align-items-center"
        >
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
              <input
                type="text"
                id="nombre"
                v-model.trim="form.nombre"
                class="form-control"
                required
              />
            </div>
          </div>

          <div class="mb-3 animate-on-scroll">
            <label for="email" class="form-label">Email</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
              <input
                type="email"
                id="email"
                v-model.trim="form.email"
                ref="emailInput"
                class="form-control"
                required
              />
            </div>
            <small v-if="form.email && !isEmailValid" class="text-warning">
              Escribe un email válido.
            </small>
          </div>

          <div class="mb-3 animate-on-scroll">
            <label for="telefono" class="form-label">Número de teléfono</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fa-solid fa-square-phone-flip"></i></span>
              <input
                type="tel"
                id="telefono"
                v-model.trim="form.telefono"
                class="form-control"
                required
              />
            </div>
          </div>

          <div class="mb-3 animate-on-scroll">
            <label for="mensaje" class="form-label">Mensaje</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fa-regular fa-comment"></i></span>
              <textarea
                id="mensaje"
                v-model.trim="form.mensaje"
                class="form-control"
                rows="4"
                required
              ></textarea>
            </div>
          </div>

          <p v-if="generalError" class="text-danger text-center mb-2">
            {{ generalError }}
          </p>

          <div class="d-flex justify-content-center align-items-center animate-on-scroll">
            <button
              v-if="!loading"
              type="submit"
              class="btn btn-primary m-0"
              :disabled="!isFormValid"
              title="Enviar"
            >
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
.btn-primary:hover { 
  background-color: #0044cc; 
}

.btn-primary:disabled { 
  opacity: .65; cursor: not-allowed; 
}

.btn-icon { 
  margin-left: 8px; 
}
.spinner-border { 
  color: var(--text-p); 
}

@media (max-width: 768px) {
  .contact-info, .contact-form { width: 100%; }
}

/* Inputs */
.form-control:focus {
  border-color: var(--text-principal);
  box-shadow: 0 0 0 0.2rem rgba(var(--text-principal), 0.25);
}

.contact-form .input-group { 
  margin-bottom: 1rem; 
}
.animate-on-scroll { 
  opacity: 0; transform: translateY(20px); transition: opacity .5s ease, 
  transform .5s ease; 
}
.animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
.col-md-6:nth-child(1) { transition-delay: .1s; }
.col-md-6:nth-child(2) { transition-delay: .2s; }
.mb-3:nth-child(1) { transition-delay: .3s; }
.mb-3:nth-child(2) { transition-delay: .4s; }
.mb-3:nth-child(3) { transition-delay: .5s; }
.mb-3:nth-child(4) { transition-delay: .6s; }
.d-flex.justify-content-center { transition-delay: .7s; }
</style>

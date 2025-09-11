<script setup>
import { ref, computed, onMounted } from 'vue'
import { alertaExito, showAlertEmail } from '@/utils/alertas'
import colors from '@/public/data/colors.json';
import contacto from '@/public/data/contacto.json'


const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  mensaje: ''
})

const limpiarDatos = () => {
  form.value.nombre = ''
  form.value.email = ''
  form.value.telefono = ''
  form.value.mensaje = ''
}

const loading = ref(false)
const emailInput = ref(null)

const isEmailValid = computed(() => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(form.value.email)
})

const focusEmailInput = () => {
  if (emailInput.value) {
    emailInput.value.focus()
  }
}

const submitForm = async () => {
  if (!isEmailValid.value) {
    showAlertEmail()
    focusEmailInput()
    return
  }

  loading.value = true
  try {
    const res = await $fetch('/api/contact', {
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
  //animacion
  const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

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
      <div class="col-md-6 animate-on-scroll">
        <div class="bg-light p-4 rounded shadow-sm contact-info h-100 d-flex flex-column justify-content-center align-items-center">
          <h2 class="">{{contacto.tittle}}</h2>
          <h3>{{contacto.subtitulo}}</h3>
          <p>{{ contacto.p1 }}</p>
          <p>
            <i class="fa-solid fa-map-pin"></i> {{contacto.direccion}}
          </p>
          <p>
            <i class="fa-solid fa-phone-volume"></i> {{contacto.celphone}}
          </p>
          <p>
            <i class="fa-solid fa-at"></i> {{ contacto.correo }}
          </p>
        </div>
      </div>
      <div class="col-md-6 animate-on-scroll">
        <form @submit.prevent="submitForm" class="contact-form bg-light p-4 rounded shadow-sm">
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
              <!-- Botón de enviar solo se muestra cuando no está cargando -->
              <button v-if="!loading" type="submit" class="btn btn-primary m-0">
                Enviar
                <i class="fa-solid fa-paper-plane btn-icon ms-2"></i>
              </button>
              <!-- Spinner solo se muestra cuando está cargando -->
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
  font-family: "Playpen Sans", cursive;
  min-height: 100vh;
}

.contact-info {
  background: linear-gradient(to right, var(--gradient1), var(--gradient2));
  color: var(--text-principal-color);
}

.contact-info h2{
  color: var(--contact-container-gradient1);
}

.contact-form {
  background: linear-gradient(to right, var(--gradient1), var(--gradient2));
  color: var(--text-principal-color)
}

.btn-primary{
  color: var(--contact-container-gradient2)
}

.btn-icon {
  margin-left: 8px;
}

.spinner-border {
  color: var(--text-p);
}

@media (max-width: 768px) {
  .contact-info, .contact-form {
    width: 100%;
  }
}
    /* CSS */
    button {
  padding: 10px 25px;
  margin: 40px;
  border: none;
  outline: none;
  color: rgb(255, 255, 255);
  background: #111;
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 10px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

button:before {
  content: "";
  background: linear-gradient(
    45deg,
    #ff0000,
    #ff7300,
    #fffb00,
    #48ff00,
    #00ffd5,
    #002bff,
    #7a00ff,
    #ff00c8,
    #ff0000
  );
  position: absolute;
  top: -2px;
  left: -2px;
  background-size: 400%;
  z-index: -1;
  filter: blur(5px);
  -webkit-filter: blur(5px);
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  animation: glowing-button 20s linear infinite;
  transition: opacity 0.3s ease-in-out;
  border-radius: 10px;
}

@keyframes glowing-button {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}

button:after {
  z-index: -1;
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: #222;
  left: 0;
  top: 0;
  border-radius: 10px;
}

.btn-primary:hover {
  background-color: var(--button-hover);
  border-color: var(--button-hover);
}

.form-control:focus {
  border-color: var(--text-principal);
  box-shadow: 0 0 0 0.2rem rgba(var(--text-principal), 0.25);
}

.contact-form .input-group {
  margin-bottom: 1rem;
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.col-md-6:nth-child(1) {
  transition-delay: 0.1s;
}

.col-md-6:nth-child(2) {
  transition-delay: 0.2s;
}

.mb-3:nth-child(1) {
  transition-delay: 0.3s;
}

.mb-3:nth-child(2) {
  transition-delay: 0.4s;
}

.mb-3:nth-child(3) {
  transition-delay: 0.5s;
}

.mb-3:nth-child(4) {
  transition-delay: 0.6s;
}

.d-flex.justify-content-center {
  transition-delay: 0.7s;
}
</style>
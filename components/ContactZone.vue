<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { alertaExito, showAlertEmail } from '@/utils/alertas'
import contacto from '~/assets/data/contacto.json'
import '../assets/styles/ContactZone.css'

const { public: { apiBase: _apiBase, simulateContact, simulateDelayMs } } = useRuntimeConfig()
const apiBase = (_apiBase || '').replace(/\/+$/, '')

// ➜ nuevo modelo con los campos de la ficha
const form = ref({
  duenios: '',            // Nombre de los dueños de la Empresa
  empresa: '',            // Nombre de la Empresa
  logoUrl: '',            // URL del logo (opcional)
  ubicacion: '',
  telefono: '',
  instagram: '',
  facebook: '',
  gmail: '',              // correo (sin @ prefijo automático)
  horario: '',
  servicio: '',
  promo: ''               // Mensaje promocional del mes
})

const loading = ref(false)
const emailInput = ref<HTMLInputElement | null>(null)
const generalError = ref<string | null>(null)

const isEmailValid = computed(() =>
  !form.value.gmail || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.value.gmail)
)
const isFormValid = computed(() =>
  !!form.value.empresa.trim() && !!form.value.telefono.trim() && isEmailValid.value
)

const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms))
const limpiar = ()=>{ 
  form.value = { duenios:'',empresa:'',logoUrl:'',ubicacion:'',telefono:'',
    instagram:'',facebook:'',gmail:'',horario:'',servicio:'',promo:'' }
  generalError.value=null
}

const submitForm = async ()=>{
  generalError.value = null
  if (!isEmailValid.value){ showAlertEmail(); emailInput.value?.focus(); return }

  if (simulateContact){
    loading.value = true
    try{ console.table(form.value); await sleep(simulateDelayMs||600); limpiar(); alertaExito() }
    catch(e:any){ generalError.value='No se pudo simular el envío.' }
    finally{ loading.value=false }
    return
  }

  if (!apiBase){ generalError.value='Falta PUBLIC_API_BASE.'; return }

  loading.value=true
  try{
    const res = await $fetch<{ok:boolean; error?:string}>(`${apiBase}/api/contact`,{
      method:'POST', body:{...form.value}, timeout:15000
    })
    if(res?.ok){ limpiar(); alertaExito() } else { throw new Error(res?.error||'Error de servidor') }
  }catch(e:any){
    console.error(e); generalError.value = e?.message || 'No se pudo enviar. Intenta más tarde.'
    alert('No se pudo enviar el mensaje. Intenta de nuevo.')
  }finally{ loading.value=false }
}

onMounted(()=>{/* solo para futuras variables si las necesitas */})
</script>

<template>
  <section class="vr-card">
    <!-- Esquinas decorativas -->
    <div class="vr-corner vr-corner--tl"></div>
    <div class="vr-corner vr-corner--br"></div>

    <header class="vr-header">
      <h2 class="vr-title">REVISTA</h2>
      <h3 class="vr-brand">Volcanes y Raíces</h3>
      <h4 class="vr-section">Datos</h4>
    </header>

    <form class="vr-form" @submit.prevent="submitForm">
      <!-- Düeños -->
      <div class="vr-row">
        <label class="vr-label">Nombre de los dueños de la Empresa:</label>
        <input v-model.trim="form.duenios" class="vr-input" type="text" />
      </div>

      <!-- Empresa y Logo -->
      <div class="vr-row">
        <label class="vr-label">Nombre de la Empresa y su Logo:</label>
        <div class="vr-two">
          <input v-model.trim="form.empresa" class="vr-input" type="text" placeholder="Nombre de la empresa" />
          <input v-model.trim="form.logoUrl" class="vr-input" type="url" placeholder="URL del logo (opcional)" />
        </div>
      </div>

      <hr class="vr-sep" />

      <!-- Ubicación -->
      <div class="vr-row">
        <label class="vr-label">
          <i class="fa-solid fa-location-dot"></i> Ubicación / Dirección:
        </label>
        <input v-model.trim="form.ubicacion" class="vr-input" type="text" />
      </div>

      <!-- Teléfono -->
      <div class="vr-row">
        <label class="vr-label">
          <i class="fa-brands fa-whatsapp"></i> Contacto de Teléfono:
        </label>
        <input v-model.trim="form.telefono" class="vr-input" type="tel" required />
      </div>

      <!-- Redes sociales -->
      <div class="vr-row">
        <label class="vr-label">Redes Sociales:</label>
        <div class="vr-social">
          <div class="vr-social-item">
            <i class="fa-brands fa-instagram"></i>
            <input v-model.trim="form.instagram" class="vr-input" type="text" placeholder="usuario o URL" />
          </div>
          <div class="vr-social-item">
            <i class="fa-brands fa-facebook-f"></i>
            <input v-model.trim="form.facebook" class="vr-input" type="text" placeholder="página o URL" />
          </div>
          <div class="vr-social-item">
            <i class="fa-regular fa-envelope"></i>
            <input v-model.trim="form.gmail" ref="emailInput" class="vr-input" type="email" placeholder="correo@ejemplo.com" />
          </div>
        </div>
        <small v-if="form.gmail && !isEmailValid" class="vr-warn">Escribe un correo válido.</small>
      </div>

      <!-- Horario -->
      <div class="vr-row">
        <label class="vr-label">Horario de servicio:</label>
        <input v-model.trim="form.horario" class="vr-input" type="text" placeholder="L-V 9:00–18:00, S 9:00–14:00" />
      </div>

      <!-- Servicio -->
      <div class="vr-row">
        <label class="vr-label">El servicio que da al cliente:</label>
        <input v-model.trim="form.servicio" class="vr-input" type="text" />
      </div>

      <!-- Mensaje promocional -->
      <div class="vr-row">
        <label class="vr-label">Mensaje promocional que desee para el mes:</label>
        <textarea v-model.trim="form.promo" class="vr-textarea" rows="3"></textarea>
      </div>

      <p v-if="generalError" class="vr-error">{{ generalError }}</p>

      <div class="vr-actions">
        <button
          v-if="!loading"
          class="vr-btn vr-btn--black"
          type="submit"
          :disabled="!isFormValid"
        >Enviar</button>
        <div v-else class="vr-spinner" aria-label="Enviando…"></div>
      </div>
    </form>
  </section>
</template>

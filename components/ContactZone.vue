<!-- components/ContactZone.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { alertaExito, showAlertEmail } from '@/utils/alertas'

const { public: { apiBase: _apiBase, simulateContact, simulateDelayMs } } = useRuntimeConfig()
const apiBase = (_apiBase || '').replace(/\/+$/, '')

const form = ref({
  duenios: '', empresa: '', logoUrl: '',
  ubicacion: '', telefono: '',
  instagram: '', facebook: '', gmail: '',
  horario: '', servicio: '', promo: ''
})

const loading = ref(false)
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
  if (!isEmailValid.value){ showAlertEmail(); return }

  if (useRuntimeConfig().public.simulateContact){
    loading.value = true
    try{ console.table(form.value); await sleep(useRuntimeConfig().public.simulateDelayMs||600); limpiar(); alertaExito() }
    catch{ generalError.value = 'No se pudo simular el envío.' }
    finally{ loading.value = false }
    return
  }

  if (!apiBase){ generalError.value='Falta PUBLIC_API_BASE.'; return }

  loading.value = true
  try{
    const res = await $fetch<{ok:boolean; error?:string}>(`${apiBase}/api/contact`,{
      method:'POST', body:{...form.value}, timeout:15000
    })
    if(res?.ok){ limpiar(); alertaExito() } else { throw new Error(res?.error||'Error de servidor') }
  }catch(e:any){
    generalError.value = e?.message || 'No se pudo enviar. Intenta más tarde.'
    alert('No se pudo enviar el mensaje. Intenta de nuevo.')
  }finally{ loading.value=false }
}
</script>

<template>
  <section class="vr-sheet">
    <header class="vr-header">
      <h2 class="vr-title">REVISTA</h2>
      <h3 class="vr-brand">Volcanes y Raíces</h3>
      <h4 class="vr-section">Datos</h4>
    </header>

    <form class="vr-form" @submit.prevent="submitForm">
      <div class="vr-row">
        <label class="vr-label">Nombre de los dueños de la Empresa:</label>
        <input v-model.trim="form.duenios" class="vr-box" type="text" />
      </div>

      <div class="vr-row">
        <label class="vr-label">Nombre de la Empresa y su Logo:</label>
        <div class="vr-two">
          <input v-model.trim="form.empresa" class="vr-box" type="text" placeholder="Nombre de la empresa" />
          <input v-model.trim="form.logoUrl" class="vr-box" type="url" placeholder="URL del logo (opcional)" />
        </div>
      </div>

      <hr class="vr-sep" />

      <div class="vr-row vr-with-icon">
        <label class="vr-label">
          <span class="vr-ico"><i class="fa-solid fa-location-dot"></i></span>
          Ubicación / Dirección:
        </label>
        <input v-model.trim="form.ubicacion" class="vr-box" type="text" />
      </div>

      <div class="vr-row vr-with-icon">
        <label class="vr-label">
          <span class="vr-ico"><i class="fa-brands fa-whatsapp"></i></span>
          Contacto de Teléfono:
        </label>
        <input v-model.trim="form.telefono" class="vr-box" type="tel" />
      </div>

      <div class="vr-row">
        <label class="vr-label">Redes Sociales:</label>
        <div class="vr-social">
          <div class="vr-social-row">
            <span class="vr-ico"><i class="fa-brands fa-instagram"></i></span>
            <input v-model.trim="form.instagram" class="vr-box" type="text" placeholder="usuario o URL" />
          </div>
          <div class="vr-social-row">
            <span class="vr-ico"><i class="fa-brands fa-facebook-f"></i></span>
            <input v-model.trim="form.facebook" class="vr-box" type="text" placeholder="página o URL" />
          </div>
          <div class="vr-social-row">
            <span class="vr-ico"><i class="fa-regular fa-envelope"></i></span>
            <input v-model.trim="form.gmail" class="vr-box" type="email" placeholder="correo@ejemplo.com" />
          </div>
        </div>
      </div>

      <div class="vr-row">
        <label class="vr-label">Horario de servicio:</label>
        <input v-model.trim="form.horario" class="vr-box" type="text" />
      </div>

      <div class="vr-row">
        <label class="vr-label">EL servicio que da al cliente:</label>
        <input v-model.trim="form.servicio" class="vr-box" type="text" />
      </div>

      <div class="vr-row">
        <label class="vr-label">Mensaje promocional que desee para el mes:</label>
        <textarea v-model.trim="form.promo" class="vr-box vr-multi" rows="3"></textarea>
      </div>

      <p v-if="generalError" class="vr-error">{{ generalError }}</p>

      <div class="vr-actions">
        <button v-if="!loading" class="vr-btn vr-btn--black" type="submit" :disabled="!isFormValid">
          Enviar
        </button>
        <div v-else class="vr-spinner" aria-label="Enviando…"></div>
      </div>
    </form>
  </section>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Great+Vibes&display=swap');

/* ===== Paleta ===== */
:root{
  --vr-turq:#10b5ad;  /* marco/triángulo turquesa */
  --vr-blue:#1a5fbf;  /* franja azul */
  --vr-navy:#3f4f67;  /* franja azul gris */
  --vr-paper:#fff;
  --vr-gray:#e3e7ec;
  --vr-gray300:#cfd6de;
  --vr-black:#000;
  --vr-white:#fff;
}

/* ===== Contenedor con marco y franjas (a prueba de recortes) ===== */
.vr-sheet{
  position: relative;
  max-width: 920px;
  margin: 28px auto;
  padding: 26px 24px 36px;
  background: var(--vr-paper);
  border-radius: 10px;
  /* Marco turquesa que no se corta + sombra */
  box-shadow: 0 0 0 8px var(--vr-turq), 0 10px 30px rgba(0,0,0,.08);
  overflow: visible;
}

/* Franjas con pseudo-elementos del contenedor */
.vr-sheet::before,
.vr-sheet::after{
  content:"";
  position:absolute;
  pointer-events:none;
}
.vr-sheet::before{
  /* esquina superior izquierda, 2 capas */
  top: 0; left: 0; width: 36%; aspect-ratio: 9/5;
  clip-path: polygon(0 0, 100% 0, 0 100%);
  background:
    linear-gradient(135deg, transparent 31%, var(--vr-turq) 32%) no-repeat,
    linear-gradient(135deg, transparent 44%, var(--vr-blue) 45%) no-repeat 22% 28%/78% 84%;
}
.vr-sheet::after{
  /* esquina inferior derecha, 3 capas */
  bottom: 0; right: 0; width: 42%; aspect-ratio: 9/5;
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  background:
    linear-gradient(315deg, transparent 31%, var(--vr-turq) 32%) no-repeat,
    linear-gradient(315deg, transparent 44%, var(--vr-blue) 45%) no-repeat 24% 40%/74% 76%,
    linear-gradient(315deg, transparent 59%, var(--vr-navy) 60%) no-repeat 48% 58%/50% 58%;
}

/* ===== Encabezado ===== */
.vr-header{ text-align:center; }
.vr-title{
  margin:0; font: 800 28px/1 "Playfair Display", serif;
  color:#11a4a0; letter-spacing:.03em;
}
.vr-brand{
  margin:4px 0 10px; font: 400 36px/1 "Great Vibes", cursive; color:#11a4a0;
}
.vr-section{
  margin:0 0 14px; font: 700 30px/1 "Playfair Display", serif; color:#000;
}

/* ===== Separador ===== */
.vr-sep{ border:0; border-top:2px solid var(--vr-gray); margin: 14px 0 18px; }

/* ===== Formulario ===== */
.vr-form{ margin-top: 6px; position: relative; z-index: 1; }
.vr-row{ display:flex; align-items:center; gap:14px; margin: 12px 0; flex-wrap: wrap; }
.vr-label{ flex: 0 0 330px; font-weight:700; color:#000; display:flex; align-items:center; gap:10px; }

/* Íconos cuadrados */
.vr-ico{
  width:34px; height:34px; display:grid; place-items:center;
  border:2px solid #000; border-radius:8px; background:#fff;
}
.vr-with-icon .vr-label{ gap:10px; }

/* === CAJAS GRISES para escribir === */
.vr-box{
  flex: 1 1 420px;
  background:#f7f8fa;             /* gris claro para diferenciar */
  border:2px solid var(--vr-gray300);
  border-radius: 10px;
  padding:.7rem .9rem;
  outline:none; font-size:1rem;
}
.vr-box::placeholder{ color:#98a1ac; }
.vr-box:focus{ border-color: var(--vr-turq); box-shadow: 0 0 0 3px rgba(16,181,173,.15); }
.vr-multi{ min-height:110px; resize: vertical; }

/* Redes */
.vr-social{ flex: 1 1 420px; }
.vr-social-row{ display:flex; align-items:center; gap:12px; margin:6px 0; }

/* Feedback */
.vr-error{ color:#b00020; text-align:center; }

/* ===== Botón negro con letras blancas ===== */
.vr-actions{ display:flex; justify-content:center; margin-top: 14px; }
.vr-btn.vr-btn--black{
  background:#000 !important;
  color:#fff !important;
  border:none; border-radius:12px;
  padding:.85rem 2rem; font-weight:800; cursor:pointer;
}
.vr-btn:disabled{ opacity:.65; cursor:not-allowed; }

/* Spinner (por si lo usas) */
.vr-spinner{ width:28px;height:28px;border-radius:50%;
  border:3px solid #d9dde3;border-top-color:#111;animation:spin .9s linear infinite }
@keyframes spin{ to{ transform: rotate(360deg); } }

/* ===== Responsive ===== */
@media (max-width: 860px){
  .vr-label{ flex-basis:100%; }
  .vr-box, .vr-social{ flex-basis:100%; }
}
</style>

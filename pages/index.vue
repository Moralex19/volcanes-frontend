<script setup>
import { useHead } from '#imports'
import HeroSlideshow from '~/components/HeroSlideshow.vue'
import WhoAreWe from '~/components/WhoAreWe.vue'
import Services from '~/components/Services.vue'
import ContactZone from '~/components/ContactZone.vue'

useHead({ title: 'Volcanes y Raices' })
</script>

<template>
  <div>
    <!-- INICIO (alto pantalla menos header) -->
    <section
      id="inicio"
      class="bg-dark text-white text-center d-flex align-items-center justify-content-center position-relative"
      style="min-height: calc(100vh - var(--header-h));"
    >
      <HeroSlideshow />
    </section>

    <!-- QUIÉNES SOMOS -->
    <section id="quienes-somos" class="py-5 bg-light section-anchor">
      <WhoAreWe />
    </section>

   <!-- issuu-->
    <section id="catalogo" class="py-5 bg-white section-anchor">
      <div class="container">
        <h2 class="mb-4 text-center">El Principito</h2>

        <div class="ratio ratio-16x9">
          <iframe
            src="https://e.issuu.com/embed.html?d=el_principito_edincr&u=volcanesyraices"
            style="border:0;"
            allowfullscreen
            title="El Principito"
          ></iframe>
        </div>
      </div>
    </section>

    <!-- SERVICIOS -->
    <section id="servicios" class="py-5 bg-light section-anchor">
      <Services />
    </section>

    <section id="contacto" class="py-5 section-anchor">
      <ContactZone />
    </section>
  </div>
</template>

<style scoped>
/* Evita que el header fijo tape los anclajes al navegar por #id */
.section-anchor {
  scroll-margin-top: calc(var(--header-h) + 10px);
}

/* Si usas video/fondo en el hero */
.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  z-index: 3;
}
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
</style>

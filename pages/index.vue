<script setup lang="ts">
import { useHead } from '#imports'
import { defineAsyncComponent } from 'vue'

useHead({ title: 'Volcanes y Raices' })

// Carga diferida; evita que el SSR evalúe estos módulos
const HeroSlideshow = defineAsyncComponent(() => import('~/components/HeroSlideshow.vue'))
const Services = defineAsyncComponent(() => import('~/components/Services.vue'))

import WhoAreWe from '~/components/WhoAreWe.vue'
import ContactZone from '~/components/ContactZone.vue'
</script>

<template>
  <div>
    <section
      id="inicio"
      class="bg-dark text-white text-center d-flex align-items-center justify-content-center position-relative"
      style="min-height: calc(100vh - var(--header-h));"
    >
      <ClientOnly>
        <HeroSlideshow />
      </ClientOnly>
    </section>

    <section id="quienes-somos" class="py-5 bg-light section-anchor">
      <WhoAreWe />
    </section>

    <section id="catalogo" class="py-5 bg-white section-anchor">
      <div class="container">
        <h2 class="mb-4 text-center">El Principito</h2>
        <div class="ratio ratio-16x9">
          <iframe
            src="https://e.issuu.com/embed.html?d=el_principito_edincr&u=volcanesyraices"
            style="border:0;"
            allowfullscreen
            loading="lazy"
            title="El Principito"
          ></iframe>
        </div>
      </div>
    </section>

    <section id="servicios" class="py-5 bg-light section-anchor">
      <ClientOnly>
        <Services />
      </ClientOnly>
    </section>

    <section id="contacto" class="py-5 section-anchor">
      <ContactZone />
    </section>
  </div>
</template>

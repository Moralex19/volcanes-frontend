 <template>
 <swiper
    :effect="'cube'"
    :cubeEffect="{ slideShadows: true, shadowOffset: 20, shadowScale: 0.94 }"
    :slidesPerView="1"
    :spaceBetween="30"
    :loop="true"
    :autoplay="{
      delay: 5000, // Cambia el delay para ajustar el tiempo entre diapositivas
      disableOnInteraction: false
    }"
    :speed="4000" 
    :modules="modules"
    class="mySwiper"
  >
    <swiper-slide v-for="(slide, index) in slides" :key="index">
      <div class="slide-content">
        <!-- Cambié el video por imágenes -->
        <img class="slide-image" :src="slide.imageSrc" alt="Imagen del slide" />
        <div class="slide-caption">
          <h2 class="slide-title">{{ slide.title }}</h2>
          <p class="slide-description">{{ slide.description }}</p>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/effect-cube';
import { EffectCube, Autoplay } from 'swiper/modules';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      modules: [EffectCube, Autoplay],
      slides: [
        {
            imageSrc: '/imagen1.png',
            title: '¡Innova tu hogar con puertas y portones modernos!',
            description: 'Transforma la entrada de tu casa o negocio con diseños de puertas y portones únicos.',
          },
          {
            imageSrc: '/imagen2.png',
            title: '¡Protecciones y barandales que fusionan seguridad y diseño!',
            description: 'Nuestros barandales y protecciones ofrecen la máxima seguridad. Crea espacios que te brinden tranquilidad y elegancia al mismo tiempo.',
          },
          {
            imageSrc: '/imagen3.jpeg',
            title: '¡Espacios llenos de luz con nuestras soluciones en cristal!',
            description: 'Aporta modernidad y amplitud a tus espacios con trabajos en cristal que resaltan la belleza y luminosidad de cualquier área.',
          },
          {
            imageSrc: '/imagen4.jpg',
            title: '¡Herrería artística para personalizar cada rincón!',
            description: 'Dale un toque personalizado a tu hogar con nuestras piezas de herrería artística.',
          },
      ],
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playpen+Sans:wght@100..800&display=swap');

body {
  font-family: inherit;
}

#app {
  height: 100%;
}

html,
body {
  position: relative;
  height: 100%;
}

body {
  background: #eee;
  font-size: 14px;
  color: #000;
  margin: 0;
  padding: 0;
}

.swiper {
  width: 100%;  
  height: 100%; 
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
}

.slide-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-image {
  width: 100%;   
  height: 100%;  
  object-fit: cover; 
  z-index: 1;
}

.slide-caption {
  position: absolute;
  top: 50%;               
  left: 50%;             
  transform: translate(-50%, -50%); 
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  z-index: 2;
  width: 80%;           
  max-width: 800px;       
}

.slide-title {
  font-family: inherit; 
  font-size: 2rem; 
  font-weight: 800; 
  margin: 0; 
}

.slide-description {
  font-family: inherit; 
  font-size: 1rem; 
  margin: 0;
  color: #ffffff; 
}
</style>*/
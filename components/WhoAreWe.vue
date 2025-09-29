<template>
  <div class="whoarewe-container">
    <div class="image-content-wrapper">
      <div class="image-section">
        <img src="/logo2.png" alt="Logo" />
      </div>
      <div class="content-section">
        <h1 class="section-title">Nosotros!!</h1>
        <p class="section-description">{{ data.description }}</p>
      </div>
    </div>
    <div class="features">
      <div v-for="(feature, index) in data.features" :key="index" class="feature">
        <i :class="feature.icon" class="social-icon" :style="{ color: feature.iconColor }"></i>
        <div class="feature-text">
          <h2>{{ feature.title }}</h2>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from '@/assets/data/WhoAreWe.json'; 

export default {
  name: 'WhoAreWe',
  data() {
    return {
      data, 
    };
  }
};
</script>

<style src="../assets/styles/WhoAreWe.css">
</style>
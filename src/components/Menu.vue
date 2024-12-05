<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usuarioActual } from '@/main';
import Usuario from './Usuario.vue';

const router = useRouter();
const isLoaded = ref(false);
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

</script>


<template>

  <div class="container menu" style="border-radius: 20px;">
    <h1 style="margin-bottom: 0;">Bienvenido a Administración</h1>
    <h2 style="color: whitesmoke; margin-top: -6px;">Sistema de Recolección de Basura</h2>
    <!-- <div class="chart">
      <h2>Recolecciones</h2>
      <apexchart width="100%" type="line" :options="options" :series="series"></apexchart>
    </div> -->
    <p style="text-wrap: wrap; margin-top: 10px;">{{ usuarioActual.nombre }}</p>
  </div>
  
</template>

<style scoped>
.menu {
  text-align: center;
}
.chart{
  margin: 0 auto;
}
</style>

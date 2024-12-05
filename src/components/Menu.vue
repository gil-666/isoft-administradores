<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoaded = ref(false);
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const usuarioActual = {
  nombre: localStorage.getItem("n_completo"),
  usuario: localStorage.getItem("n_usuario"),
  correo: localStorage.getItem("n_correo"),
  telefono: localStorage.getItem("admin_tel"),
  foto: localStorage.getItem("admin_foto")
};
</script>


<template>

  <div class="container menu" style="border-radius: 20px;">
    <h1>Bienvenido</h1>
    <!-- <div class="chart">
      <h2>Recolecciones</h2>
      <apexchart width="100%" type="line" :options="options" :series="series"></apexchart>
    </div> -->
    <h4 style="color: white;">toma los datos de este arreglo y hazle bonis</h4>
    <p>{{ usuarioActual }}</p>
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

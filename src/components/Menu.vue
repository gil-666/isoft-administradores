<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoaded = ref(false);
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

</script>


<template>

  <div class="container menu" style="border-radius: 20px;">
    <h1>Bienvenido</h1>
    <!-- <div class="chart">
      <h2>Recolecciones</h2>
      <apexchart width="100%" type="line" :options="options" :series="series"></apexchart>
    </div> -->
    
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

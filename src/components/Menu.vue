<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoaded = ref(false);
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//ejemplo de ventas
const series = ref([
  {
    name: "Recolecciones",
    data: [30, 40, 35, 50, 49, 60, 70],
  },
]);

const options = ref({
  xaxis: {
    categories: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          width: "100%",
          height: 300,
        },
      },
    },
  ],
});

</script>


<template>

  <div class="container menu" style="border-radius: 20px;">
    <h1>Bienvenido</h1>
    <div class="chart">
      <h2>Recolecciones</h2>
      <apexchart width="100%" type="line" :options="options" :series="series"></apexchart>
    </div>
    
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

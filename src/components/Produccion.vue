<template>
    <v-progress-circular class="loading-circle" v-if="!isLoaded" color="primary" indeterminate></v-progress-circular>
    <v-container v-if="isLoaded" class="container ">
        <v-card>
            <v-card-title>
                Producción de composta
            </v-card-title>
            <v-data-table :headers="headers" :items="produccion" class="elevation-1 " :search="search">
                <template v-slot:top>
                    <v-text-field v-model="search" label="Buscar en la producción" class="mx-4"
                        append-icon="mdi-magnify"></v-text-field>
                    <v-card-title>
                        Producción total: <span>{{ totalProduccion }}kg</span>
                    </v-card-title>
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card>
            <v-card-title>
                Inventario de composta
            </v-card-title>
            <div class="chart">
                <apexchart width="100%" type="bar" :options="options" :series="series"></apexchart>
            </div>
        </v-card>

    </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import * as controller from '../Controller';
const isLoaded = ref(false);
const data = ref();
const produccion = ref([]);
const search = ref('');
onMounted(async () => {
    isLoaded.value = false;
    try {
        data.value = await controller.obtenerProduccion();
        if (data.value && Array.isArray(data.value)) {
            produccion.value = data.value;
        }
        fetchData();
    } catch (error) {
        isLoaded.value = false;
        console.error("Error fetching users:", error);
    } finally {
        isLoaded.value = true;
    }
});

console.log("produccion array ", produccion);
const headers = ref([
    { title: 'ID', value: 'h_ID' },
    { title: 'Cantidad Actual (kg)', value: 'Cantidad' },
    { title: 'Fecha', value: 'Fecha' },
    { title: 'Nombre de Inventario', value: 'NombreInventario' },
    { title: 'Nombre de Compostero', value: 'n_completo' },
    { title: 'Usuario', value: 'n_usuario' },
]);

const totalProduccion = computed(() => {
    const sum = produccion.value.reduce((sum, item) => sum + (item.Cantidad || 0), 0);
    return sum.toFixed(3);
});

const series = ref([
  {
    name: "Cantidad (kg)",
    data: [],
  },
]);

const options = ref({
  xaxis: {
    categories: [],
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

const fetchData = async () => {
      try {
        const data = await controller.obtenerProduccionInv();
        console.log(data); 
        // Map the data to the format expected by the chart
        const categories = data.map(item => item.NombreInventario);
        console.log("categories", categories);
        const cantidadData = data.map(item => item.CantidadActual);

        // Update the chart's options and series with the fetched data
        options.value = { ...options.value, xaxis: { categories } };
    series.value = [{ name: 'Cantidad (kg)', data: cantidadData }];
        console.log("categories options", options.value.xaxis.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
</script>

<style scoped>
.custom-table .v-data-table-header th {
    color: black !important;
    font-weight: bold;
    text-align: center;
}

.container {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    max-width: 900px;
    margin: 0 auto;
}

.v-chip {
    font-weight: bold;
}

.loading-circle {
    text-align: center;
    display: block;
    margin: 0 auto;
}
</style>
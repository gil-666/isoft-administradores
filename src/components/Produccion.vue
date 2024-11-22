<template>
    <v-progress-circular class="loading-circle" v-if="!isLoaded" color="primary" indeterminate></v-progress-circular>
    <v-container v-if="isLoaded" class="container ">
        <v-card class="data-table">
            <v-card-title class="data-table-title">
                Producción de composta
            </v-card-title>
            <v-data-table :headers="headers" :items="produccion" class="elevation-1 data-table" :search="search">
                <template v-slot:top>
                    <v-text-field v-model="search" label="Buscar en la producción" class="mx-4"
                        append-icon="mdi-magnify"></v-text-field>
                    
                </template>
                <template v-slot:item.Fecha="{ item }"> <!-- si no hay fecha final muestra n/a-->
          <span>{{ fechaCorto(item.Fecha) || 'N/A' }}</span>
        </template>
                <template v-slot:item.Cantidad="{ item }">
                    <span class="prod-total-title" style="padding: 8px; font-weight: bold;">{{ item.Cantidad }}</span>
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card class="data-table">
            <v-card-title class="data-table-title">
                Inventario de composta
            </v-card-title>
            <v-card-title class="prod-total-title">
                        Producción total: <span>{{ totalProduccion }}kg</span>
                    </v-card-title>
            <div class="chart">
                <apexchart v-if="options && series && options.xaxis.categories.length > 0 && series[0].data.length > 0" width="100%" type="bar" :options="options" :series="series" ></apexchart>
            <!-- no funciona en movil sin este invento -->
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
const series = ref();
const options = ref();
import { fechaCorto } from '@/tools';
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
    { title: 'Cantidad Actual (kg)', value: 'Cantidad', sortable: true },
    { title: 'Fecha', value: 'Fecha', sortable: true },
    { title: 'Nombre de Inventario', value: 'NombreInventario', sortable: true },
    { title: 'Nombre de Compostero', value: 'n_completo', sortable: true },
    { title: 'Usuario', value: 'n_usuario', sortable: true },
]);

const totalProduccion = computed(() => { //suma la cantidad de desechos
    const sum = produccion.value.reduce((sum, item) => sum + (item.Cantidad || 0), 0);
    return sum.toFixed(3);
});



const fetchData = async () => {
  try {
    const data = await controller.obtenerProduccionInv();
    console.log(data); 
    // obtiene los datos del arreglo de cada objeto individualmente
    const categories = data.map(item => item.NombreInventario);
    console.log("categories", categories);
    const cantidadData = data.map(item => item.CantidadActual);

    // crea los parametros de la tabla
    options.value = { 
      ...options.value,
      xaxis: {
        categories,
        labels: {
          style: {
            colors: '#007bff',
            fontSize: '14px',
            fontWeight: 600,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#007bff', 
            fontSize: '14px',
            fontWeight: 600,
          },
        },
      },
    };

    series.value = [{ name: 'Cantidad (kg)', data: cantidadData }];
    console.log("categories options", options.value.xaxis.categories);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

</script>

<style src="../assets/main.css" scoped>

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
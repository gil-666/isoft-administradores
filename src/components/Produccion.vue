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
    } catch (error) {
        isLoaded.value = false;
        console.error("Error fetching users:", error);
    } finally {
        isLoaded.value = true;
    }
});

console.log("produccion array ", produccion);
const headers = ref([
    { title: 'ID', value: 'ID' },
    { title: 'Cantidad Actual (kg)', value: 'CantidadActual' },
    { title: 'Nombre de Inventario', value: 'NombreInventario' },
    { title: 'Nombre de Compostero', value: 'n_completo' },
    { title: 'Usuario', value: 'n_usuario' },
]);

const totalProduccion = computed(() =>
    produccion.value.reduce((sum, item) => sum + (item.CantidadActual || 0), 0)
);

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
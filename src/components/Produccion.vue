<template>
    <v-progress-circular class="loading-circle" v-if="!isLoaded" color="primary" indeterminate></v-progress-circular>
    <v-container v-if="isLoaded" class="container ">
        <v-card class="data-table">
            <v-card-title class="data-table-title">
                Producción de composta
            </v-card-title>
            <v-data-table :headers="headers" :items="filteredProduccion" class="elevation-1 data-table"
                :search="search">
                <template v-slot:top>
                    <v-chip @click="filtroSelectUsuario = null; filtroSelectInventario = null; search = ''"
                        v-if="filtroSelectUsuario != null || filtroSelectInventario != null"
                        style="background-color: #007bff; color: white ;max-width: 50%;margin: 0 auto;">Restablecer
                        filtro</v-chip><br>
                    <v-container class="filter-control">
                        <v-col v-if="!idSearch">
                            <v-row>
                                <v-card-subtitle class="filter-title" style="margin: 0 auto;">Filtros</v-card-subtitle>
                            </v-row>
                            <v-row style="gap: 10px;">
                                <!-- <FilterComboBox v-model:selection="filtroSelect" :items="estadofiltros"
                                :filtroSelect="filterModel" :label="'Por inventario'"
                                :placeholder="'Filtrar solicitudes por Inventario'"
                                @update:selection="(value) => { console.log(value); filtroSelect = value }"
                                style="max-width: 180px;"></FilterComboBox> -->

                                <FilterComboBox v-model:selection="filtroSelectUsuario"
                                    :items="[...new Map(produccion.map(item => [item.n_completo, item])).values()]"
                                    :filtroSelect="filterModelUsuario" :label="'Por compostero'"
                                    :placeholder="'Filtrar solicitudes por compostero'" :itemtitle="'n_completo'"
                                    :itemvalue="'id_usuario'"
                                    @update:selection="(value) => { console.log(value); filtroSelectUsuario = value }"
                                    style="min-width: 150px;"></FilterComboBox>

                                <FilterComboBox v-model:selection="filtroSelectInventario"
                                    :items="[...new Map(produccion.map(item => [item.NombreInventario, item])).values()]"
                                    :filtroSelect="filterModelInventario" :label="'Por inventario'"
                                    :placeholder="'Filtrar solicitudes por inventario'" :itemtitle="'NombreInventario'"
                                    :itemvalue="'inv_ID'"
                                    @update:selection="(value) => { console.log(value); filtroSelectInventario = value }"
                                    style="min-width: 150px;"></FilterComboBox>
                            </v-row>


                        </v-col>

                        <v-text-field v-model="search" label="Buscar en la producción"
                            append-icon="mdi-magnify"></v-text-field>
                    </v-container>
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
                <apexchart v-if="options && series && options.xaxis.categories.length > 0 && series[0].data.length > 0"
                    width="100%" type="bar" :options="options" :series="series"></apexchart>
                <!-- no funciona en movil sin este invento -->
            </div>
        </v-card>
        <br>
        <v-card class="data-table">
            <v-card-title class="data-table-title">
                Envíos de composta
            </v-card-title>
            <v-data-table :headers="headersenv" :items="dataenvios" class="elevation-1 data-table" :search="search">
                <template v-slot:item.FechaPeticion="{ item }"> <!-- si no hay fecha final muestra n/a-->
                    <span>{{ fechaCorto(item.FechaPeticion) || 'N/A' }}</span>
                </template>
                <template v-slot:item.FechaEnvio="{ item }"> <!-- si no hay fecha final muestra n/a-->
                    <span>{{ item.FechaEnvio ? fechaCorto(item.FechaEnvio) : 'N/A' }}</span>
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card class="data-table">
            <v-card-title class="data-table-title">
                Historial de desechos
            </v-card-title>
            <v-data-table :headers="headershistdes" :items="desechosHistorial" class="elevation-1 data-table" :search="search">
                <template v-slot:item.Fecha="{ item }"> <!-- si no hay fecha final muestra n/a-->
                    <span>{{ fechaCorto(item.Fecha) || 'N/A' }}</span>
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card class="data-table">
            <v-card-title class="data-table-title">
                Inventario de desechos
            </v-card-title>
            <v-card-title class="prod-total-title">
                Desechos totales: <span>{{ totalDesechos }}kg</span>
            </v-card-title>
            <div class="chart">
                <div class="chart">
                    <apexchart
                        v-if="optionsDesechos && seriesDesechos && optionsDesechos.xaxis.categories.length > 0 && seriesDesechos[0].data.length > 0"
                        width="100%" type="bar" :options="optionsDesechos" :series="seriesDesechos"></apexchart>
                </div>
                <!-- no funciona en movil sin este invento -->
            </div>
        </v-card>

    </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import * as controller from '../Controller';
import FilterComboBox from './elements/FilterComboBox.vue';
const isLoaded = ref(false);
const data = ref();
const dataenvios = ref();
const produccion = ref([]);
const search = ref('');
const series = ref();
const options = ref();
const filterModel = ref('');
const filterModelUsuario = ref('');
const filterModelInventario = ref('');
const filtroSelect = ref('');
const filtroSelectUsuario = ref(null);
const filtroSelectInventario = ref(null);
const optionsDesechos = ref();
const seriesDesechos = ref();
const desechosInvData = ref();
const desechosHistorial = ref();
import { fechaCorto } from '@/tools';
onMounted(async () => {
    isLoaded.value = false;
    try {
        data.value = await controller.obtenerProduccion();
        dataenvios.value = await controller.obtenerEnvios();
        desechosInvData.value = await controller.obtenerDesechosInventario();
        desechosHistorial.value = await controller.obtenerDesechosHistorial();
        if (data.value && Array.isArray(data.value)) {
            produccion.value = data.value;
        }
        fetchData();
        fetchDesechosData();
    } catch (error) {
        isLoaded.value = false;
        console.error("Error fetching users:", error);
    } finally {
        isLoaded.value = true;
    }
});

const filteredProduccion = computed(() => { //filtra automaticamente si hay una busqueda general 
    //o si hay argumento para buscar un solo id
    //o si el combobox de filtrar por estado esta seleccionado
    return produccion.value.filter(item => {
        // console.log("item: ",item)
        // const matchesIdSearch = !idSearch.value || item.idsol_usuario.toString() === (idSearch.value);
        const matchesGeneralSearch = search.value || Object.values(item).some(val =>
            val.toString().toLowerCase().includes(search.value.toLowerCase())
        );
        // const comboBoxFilter = filtroSelect.value === "Todas" || item.estado.toString() === filtroSelect.value;
        const comboBoxFilterUsuario = filtroSelectUsuario.value == null || item.id_usuario === filtroSelectUsuario.value;
        const comboBoxFilterInventario = filtroSelectInventario.value == null || item.inv_ID === filtroSelectInventario.value;
        return comboBoxFilterInventario && (comboBoxFilterUsuario && (matchesGeneralSearch));

    });
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

const headersenv = ref([
    { title: 'ID', value: 'ID' },
    { title: 'Cantidad (kg)', value: 'Cantidad', sortable: true },
    { title: 'Placa', value: 'Placa', sortable: true },
    { title: 'Chofer', value: 'Chofer', sortable: true },
    { title: 'Fecha Peticion', value: 'FechaPeticion', sortable: true },
    { title: 'Fecha Envío', value: 'FechaEnvio', sortable: true },
]);

const headershistdes = ref([
    { title: 'ID', value: 'ID' },
    { title: 'Cantidad (kg)', value: 'Cantidad', sortable: true },
    { title: 'Fecha', value: 'Fecha', sortable: true },
    { title: 'Nombre de Inventario', value: 'NombreInventario', sortable: true },
    { title: 'Nombre de Compostero', value: 'n_completo', sortable: true },
    { title: 'Usuario', value: 'n_usuario', sortable: true },
]);

const totalProduccion = computed(() => { //suma la cantidad de desechos
    const sum = produccion.value.reduce((sum, item) => sum + (item.Cantidad || 0), 0);
    return sum.toFixed(3);
});

const totalDesechos = computed(() => { //suma la cantidad de desechos
    const sum = desechosInvData.value.reduce((sum, item) => sum + (item.CantidadActual || 0), 0);
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

const fetchDesechosData = async () => {
    try {
        const data = await controller.obtenerDesechosInventario();
        console.log("sas",data);

        // Extract categories (NombreInventario) and corresponding data (Cantidad)
        const categories = data.map(item => item.NombreInventario);
        const cantidadData = data.map(item => item.CantidadActual);

        // Update chart options for the second chart
        optionsDesechos.value = {
            chart: {
                type: 'bar',
                height: 350,
            },
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

        // Update the series data for the second chart
        seriesDesechos.value = [{ name: 'Cantidad (kg)', data: cantidadData }];
        console.log("Desechos chart categories", optionsDesechos.value.xaxis.categories);
    } catch (error) {
        console.error('Error fetching Desechos data:', error);
    }
};

</script>

<style src="../assets/main.css" scoped></style>
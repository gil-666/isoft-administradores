<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import mapa from './elements/Mapa.vue';
import Solicitudes from './Solicitudes.vue';
import FilterComboBox from './elements/FilterComboBox.vue';
import * as controller from '../Controller.js';
const solicitudes = ref([]);
const data = ref();
const isLoaded = ref(false);
const search = ref('');
const filtroSelectUsuario = ref(null);
const filterModelUsuario = ref('');
const filtroSelectRecolector = ref(null);
const filterModelRecolector = ref('');
const headers = ref([
    { title: 'ID Solicitud', value: 'idsol_usuario', sortable: true },
    { title: 'Tipo', value: 'sol_tipo', sortable: true },
    { title: 'Domicilio', value: 'direccion_completa', sortable: true },
    { title: 'Nombre Completo', value: 'n_completo', sortable: true },
    { title: 'Nombre del recolector', value: 'recolector_nombre', sortable: true },
    { title: 'Estado', value: 'estado' },

    // { title: 'Fecha de Finalización', value: 'sol_fechaDeFinalizacion' },
    // { title: 'Nombre de Usuario', value: 'n_usuario' },

    //   { title: 'Estado', value: 'estado', sortable: true },
    { title: '', value: 'details' }

]);
onMounted(async () => {
    isLoaded.value = false;
    try {
        data.value = await controller.obtenerRutas();
        console.log(data);
        if (data.value && Array.isArray(data.value)) {
            solicitudes.value = data.value;
        }
    } catch (error) {
        isLoaded.value = false;
        console.error("Error fetching users:", error);
    } finally {
        isLoaded.value = true;
    }
});

const actualizarEstadoRecoleccion = async (estado, idsol_usuario) => {
    try {
        const formData = [{
            idsol_usuario: idsol_usuario,
            estado: estado
        }]
        await controller.actualizarEstadoRecoleccion(formData);
        console.log(`Estado actualizado a: ${formData[0].estado}`);
        window.location.reload();
    } catch (error) {
        console.error('Error al actualizar estado:', error);
    }
};

const filteredSolicitudes = computed(() => { //filtra automaticamente si hay una busqueda general 
    //o si hay argumento para buscar un solo id
    //o si el combobox de filtrar por estado esta seleccionado
    return solicitudes.value.filter(item => {
        // console.log("item: ",item)
        // const matchesIdSearch = !idSearch.value || item.idsol_usuario.toString() === (idSearch.value);
        const matchesGeneralSearch = search.value || Object.values(item).some(val =>
            val.toString().toLowerCase().includes(search.value.toLowerCase())
        );
        // const comboBoxFilter = filtroSelect.value === "Todas" || item.estado.toString() === filtroSelect.value;
        const comboBoxFilterUsuario = filtroSelectUsuario.value == null || item.n_completo === filtroSelectUsuario.value;
        const comboBoxFilterRecolector = filtroSelectRecolector.value == null || item.recolector_nombre === filtroSelectRecolector.value;
        return comboBoxFilterRecolector && (comboBoxFilterUsuario && (matchesGeneralSearch));

    });
});
</script>
<template>
    <v-container class="container">
        <v-card class="data-table">
            <v-card-title class="data-table-title">
                Rutas
            </v-card-title>

            <v-row>
                <v-container>
                    <v-card class="data-table">
                        <mapa></mapa>
                    </v-card>
                    <v-card style="text-align: center; padding: 20px;" class="data-table"><span style="opacity: 100; background-color:#007bff; padding: 10px; border-radius: 50px ; margin: 10px">‎ </span> Recoleccion<span style="opacity: 100; background-color:#ffa500; padding: 10px; border-radius: 50px ; margin: 10px">‎ </span> Entrega</v-card>
                </v-container>
            </v-row>

            <v-row>
                <!-- <v-card-title class="data-table-title" style="text-align: center; width: 100%;">
                Solicitudes de Recolección
            </v-card-title> -->
                <v-container>
                    <v-data-table :headers="headers" :items="filteredSolicitudes" class="elevation-1 data-table"
                        :search="search">
                        <template v-slot:top>
                            <v-chip
                                @click="$router.push($route.path === '/rutas' ? '/rutas' : '/solicitudes'); filtroSelectUsuario = null; filtroSelect = 'Todas'; filtroSelectRecolector = null; search = ''"
                                v-if="filtroSelectUsuario != null || filtroSelectRecolector != null"
                                style="background-color: #007bff; color: white ;max-width: 50%;margin: 0 auto;">Restablecer
                                filtro</v-chip><br>
                            <v-container class="filter-control">
                                <v-col>

                                    <v-row>
                                        <v-card-subtitle style="margin: 0 auto;"
                                            class="filter-title">Filtros</v-card-subtitle>
                                    </v-row>

                                    <v-row style="gap: 10px;">

                                        <FilterComboBox v-model:selection="filtroSelectUsuario"
                                            :items="[...new Map(solicitudes.map(item => [item.n_completo, item])).values()]"
                                            :filtroSelect="filterModelUsuario" :label="'Por usuario'"
                                            :placeholder="'Filtrar solicitudes por usuario'" :itemtitle="'n_completo'"
                                            :itemvalue="'usuario_id_usuario'"
                                            @update:selection="(value) => { console.log(value); filtroSelectUsuario = value }"
                                            style="min-width: 150px;"></FilterComboBox>

                                        <FilterComboBox v-model:selection="filtroSelectRecolector"
                                            :items="[...new Map(solicitudes.map(item => [item.recolector_nombre, item])).values()]"
                                            :filtroSelect="filterModelRecolector" :label="'Por recolector'"
                                            :placeholder="'Filtrar solicitudes por recolector'"
                                            :itemtitle="'recolector_nombre'" :itemvalue="'usuarios_id_usuario'"
                                            @update:selection="(value) => { console.log(value); filtroSelectRecolector = value }"
                                            style="min-width: 150px;"></FilterComboBox>
                                    </v-row>


                                </v-col>

                                <v-text-field v-model="search" v-if="!idSearch" label="Buscar rutas"
                                    append-icon="mdi-magnify"></v-text-field>

                            </v-container>
                        </template>
                        <template v-slot:item.estado="{ item }">
                            <div>
                                <v-chip
                                    :color="item.estado === 'Completado' ? 'green' : item.estado === 'Pendiente' ? 'yellow' : 'red'"
                                    dark @click="item.isEditingEstado = !item.isEditingEstado"
                                    style="font-weight: bold; text-align: center; color: white; border-radius: 16px; padding: 0 16px; min-width: auto; height: 30px;">
                                    {{ item.estado }}
                                </v-chip>
                                <!-- menu dropdown-->
                                <v-menu v-model="item.isEditingEstado" close-on-content-click class="custom-menu ">
                                    <template v-slot:activator="{ props }">
                                        <!-- asegura que el menu este vinculado al v-chip -->
                                        <div v-bind="props"></div>
                                    </template>
                                    <v-list :bg-color="darkTheme ? '#333' : 'white'" class="data-table">
                                        <!-- excluir la actualmente seleccionada -->
                                        <v-list-item class="data-table"
                                            v-for="option in ['Completado', 'Pendiente', 'Cancelado'].filter(o => o !== item.estado)"
                                            :key="option"
                                            @click="() => { item.estado = option; item.isEditingEstado = false; actualizarEstadoRecoleccion(option, item.idsol_usuario) }">
                                            <v-list-item-title>{{ option }}</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>

                            </div>
                        </template>
                    </v-data-table>
                    </v-container>
            </v-row>
    
    </v-card>

    </v-container>

</template>
<style src="../assets/main.css" scoped></style>
<script setup>
import { ref, onMounted, watch } from 'vue';
import mapa from './elements/Mapa.vue';
import Solicitudes from './Solicitudes.vue';
import * as controller from '../Controller.js';
const solicitudes = ref([]);
const data = ref();
const isLoaded = ref(false);
const headers = ref([
    { title: 'ID', value: 'idsol_usuario' },
    { title: 'Tipo', value: 'sol_tipo' },
    { title: 'Domicilio', value: 'direccion_completa', sortable: true },
    { title: 'Nombre Completo', value: 'n_completo', sortable: true },
    { title: 'Estado', value: 'estado', sortable: true },
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
</script>
<template>
    <v-container class="container">
        <v-card class="data-table">
            <v-card-title class="data-table-title">
                Solicitudes de Recolección
            </v-card-title>
        
        <v-row>
            <v-container>
                <v-card class="data-table">
                    <mapa></mapa>
                </v-card>
            </v-container>

        </v-row>
    
        <v-row>
            <v-data-table :headers="headers" :items="solicitudes" class="elevation-1 data-table">
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
        </v-row>
    </v-card>
    </v-container>

</template>
<style src="../assets/main.css" scoped></style>
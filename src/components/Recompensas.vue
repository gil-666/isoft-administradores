<template>
    <v-progress-circular class="loading-circle" v-if="!isLoaded" color="primary" indeterminate></v-progress-circular>
    <v-container v-if="isLoaded" class="container ">
      <v-card>
        <v-card-title>
          Recompensas
        </v-card-title>
  
        <v-data-table :headers="headers" :items="solicitudes" class="elevation-1 " :search="search">
          <template v-slot:top>
            <v-text-field v-model="search" label="Buscar solicitud" class="mx-4" append-icon="mdi-magnify"></v-text-field>
          </template>
          <!-- boton 'ir a solicitud' -->
          <template v-slot:item.idsol_recoleccion="{ item }">
            <v-chip @click="router.push(`/solicitudes?idsol_usuario=${ item.idsol_recoleccion }`)">Ir a solicitud<v-icon small>mdi-open-in-new</v-icon></v-chip> <!-- agrega el argumento del id solicitud para iniciar un busqueda -->
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import * as controller from '../Controller';
  import { useRoute, useRouter } from 'vue-router';
  const isLoaded = ref(false);
  const data = ref();
  const solicitudes = ref([]);
  const search = ref('');
  const router = useRouter();
  onMounted(async () => {
    isLoaded.value = false;
    try {
      data.value = await controller.obtenerRecompensas();
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
  
  console.log("solicitudes array ", solicitudes);
  const headers = ref([
    { title: 'ID', value: 'id_recompensa' },
    { title: 'Cantidad de puntos', value: 'rec_cantidadpuntos' },
    { title: 'Fecha y hora', value: 'rec_horaFecha' },
    { title: 'Comentario', value: 'rec_comentario' },
    { title: 'Solicitud de usuario', value: 'idsol_recoleccion' },
]);
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
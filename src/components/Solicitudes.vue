<template>
    <v-progress-circular v-if="!isLoaded" color="primary" indeterminate></v-progress-circular>
    <v-container v-if="isLoaded" class="container ">
      <v-card>
        <v-card-title>
          Solicitudes de Recolección
        </v-card-title>
  
        <v-data-table
          :headers="headers"
          
          :items="solicitudes"
          class="elevation-1 "
          :search="search"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Buscar solicitud"
              class="mx-4"
              append-icon="mdi-magnify"
            ></v-text-field>
          </template>
  
          <template v-slot:item.estado="{ item }">
          <v-chip
            :color="item.estado === 'Completado' ? 'green' : item.estado === 'Pendiente' ? 'yellow' : 'red'"
            dark
          >
            {{ item.estado }}
          </v-chip>
        </template>
        </v-data-table>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import * as controller from '../Controller';
  const isLoaded = ref(false);
const data = ref();
const solicitudes = ref([]);
const search = ref('');
try {
  data.value = await controller.obtenerSolicitudes();
  if (data.value && Array.isArray(data.value)) {
    
    solicitudes.value = data.value;
  }
} catch (error) {
  isLoaded.value = false;
  console.error("Error fetching users:", error);
}finally{
  isLoaded.value = true;
}
console.log("solicitudes array ",solicitudes);
  const headers = ref([
  { title: 'Estado', value: 'estado' },
        { title: 'Fecha de Solicitud', value: 'sol_fechaDeSolicitud' },
        { title: 'Fecha de Finalización', value: 'sol_fechaDeFinalizacion'},
        { title: 'Tipo de Solicitud', value: 'sol_tipo' },
        { title: 'Nombre de Usuario', value: 'n_usuario' },
        { title: 'Nombre Completo', value: 'n_completo' },
        { title: 'Tipo de Usuario', value: 'tipo' },
        { title: 'Nombre de Recolector', value: 'nombre_recolector' },
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


  </style>
  
<template>
    <v-container class="container">
      <v-card>
        <v-card-title>
          Solicitudes de Recolección
        </v-card-title>
  
        <v-data-table
          :headers="headers"
          
          :items="solicitudes"
          item-value="id"
          class="elevation-1"
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
  
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.status === 'Completado' ? 'green' : item.status === 'Pendiente' ? 'yellow' : 'red'"
              dark
            >
              {{ item.status }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const search = ref('');
  const solicitudes = ref([
    { id: 1, name: 'Juan Pérez', date: '2024-10-01', status: 'Completado', des_com: 'Varios', des_kg: '10kg' },
    { id: 2, name: 'Ana López', date: '2024-10-05', status: 'Pendiente', des_com: 'Papel', des_kg: '2kg' },
    { id: 3, name: 'Carlos Sánchez', date: '2024-10-12', status: 'Cancelado', des_com: 'Muebles', des_kg: '34kg' },
  ]);
  
  const headers = ref([
    { title: 'ID', value: 'id', align: 'start' },
    { title: 'Nombre del ciudadano', value: 'name' },
    { title: 'Des. comentario', value: 'des_com' },
    { title: 'Des. peso (kg)', value: 'des_kg' },
    { title: 'Fecha de solicitud', value: 'date' },
    { title: 'Estado', value: 'status' },
  ]);
  </script>
  
  <style scoped>
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

  .custom-table .v-data-table-header th {
  color: black !important;
  font-weight: bold;
  text-align: center;
}
  </style>
  
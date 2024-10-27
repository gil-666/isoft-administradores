<template>
    <v-container class="container">
      <v-row>
        <v-col cols="12">
  
          <!-- Formulario para agregar una sanción -->
          <v-card class="sanction-form">
            <v-card-title>
              Gestión de Sanciones
            </v-card-title>
            <v-card-text>
              <v-form v-model="valid" ref="form">
                <v-select
                  v-model="selectedUser"
                 
                  item-text="name"
                  item-value="id"
                  label="Selecciona un usuario"
                  placeholder="Usuario sancionado"
                  :rules="[rules.required]"
                  required
                ></v-select>
  
                <v-text-field
                  v-model="sanctionReason"
                  label="Razón de la sanción"
                  placeholder="Motivo de la sanción"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
  
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="sanctionDate"
                      label="Fecha de la sanción"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="sanctionDate" @input="menu = false"></v-date-picker>
                </v-menu>
  
                <v-btn @click="addSanction" :disabled="!valid" color="success">
                  Agregar Sanción
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
  
          <!-- Lista de sanciones -->
          <v-card class="sanction-list">
            <v-card-title>
              <h2>Lista de Sanciones</h2>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="sanctions"
              class="elevation-1"
              item-value="id"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn @click="editSanction(item)" color="primary" class="mr-2">
                  Editar
                </v-btn>
                <v-btn @click="deleteSanction(item)" color="error">
                  Eliminar
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const valid = ref(false);
  const selectedUser = ref(null);
  const sanctionReason = ref('');
  const sanctionDate = ref('');
  const menu = ref(false);
  const users = [
    { id: 1, name: 'Juan Perez' },
    { id: 2, name: 'Maria Garcia' },
    { id: 3, name: 'Carlos Ruiz' },
  ];
  const sanctions = ref([
    { id: 1, user: 'Juan Perez', reason: 'No abrio la puerta (3 intentos)', date: '2024-09-15' },
  ]);
  
  const headers = [
    { text: 'ID', value: 'id' },
    { text: 'Usuario', value: 'user' },
    { text: 'Razón', value: 'reason' },
    { text: 'Fecha', value: 'date' },
    { text: 'Acciones', value: 'actions', sortable: false },
  ];
  
  const rules = {
    required: value => !!value || 'Este campo es requerido',
  };
  
  const addSanction = () => {
    if (valid.value && selectedUser.value && sanctionReason.value && sanctionDate.value) {
      const user = users.find(u => u.id === selectedUser.value);
      sanctions.value.push({
        id: sanctions.value.length + 1,
        user: user.name,
        reason: sanctionReason.value,
        date: sanctionDate.value,
      });
  
      selectedUser.value = null;
      sanctionReason.value = '';
      sanctionDate.value = '';
    }
  };
  
  const editSanction = sanction => {
    selectedUser.value = users.find(u => u.name === sanction.user).id;
    sanctionReason.value = sanction.reason;
    sanctionDate.value = sanction.date;
  };
  
  const deleteSanction = sanction => {
    sanctions.value = sanctions.value.filter(s => s.id !== sanction.id);
  };
  </script>
  
  <style scoped>
  .container {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    max-width: 900px;
    margin: 0 auto;
  }
  
  .sanction-form {
    margin-bottom: 20px;
  }
  
  .sanction-list {
    margin-top: 20px;
  }
  </style>
  
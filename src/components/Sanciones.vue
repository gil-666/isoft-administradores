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
              <v-select v-model="selectedUser" :items="usuariosNombre" item-text="name" item-value="id_usuario"
                label="Selecciona un usuario" placeholder="Usuario sancionado" :rules="[rules.required]" required>
              </v-select>



              <v-text-field v-model="sanctionReason" label="Razón de la sanción" placeholder="Escribe aquí"
                :rules="[rules.required]" required></v-text-field>

              <!-- Date Picker -->
              <v-row align="center" style="display: flex;">
                <v-col>
                  <v-text-field v-model="sanctionDate" label="Fecha de la sanción" readonly :rules="[rules.required]"
                    required></v-text-field>
                </v-col>
                <input type="datetime-local" v-model="sanctionDate" :min="minDate" required />
              </v-row>

              <!-- Regular date picker (HTML input type="date") -->


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
          <v-data-table :headers="headers" :items="sanctions" class="elevation-1" item-value="id">
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
import * as controller from '../Controller';

const valid = ref(false);
const selectedUser = ref(null);
const sanctionReason = ref('');
const sanctionDate = ref('');
const menu = ref(false);

const datausuarios = await controller.obtenerUsuarios();
const listausuarios = ref(datausuarios);
const usuariosNombre = ref('');
usuariosNombre.value = datausuarios.map(user => ({
  name: `${user.n_completo}, Usuario: ${user.n_usuario}`,
  id_usuario: user.id_usuario
}));
console.log(usuariosNombre.value);

const sanctions = ref(await controller.obtenerSanciones());
const headers = [
  { title: 'ID', value: 'id_sancion' },
  { title: 'Usuario', value: 'usuario_nombre' },
  { title: 'Razón', value: 'sanc_motivo' },
  { title: 'Fecha', value: 'sanc_fechaHora' },
  { title: 'Acciones', value: 'actions', sortable: false },
];

const rules = {
  required: value => !!value || 'Este campo es requerido',
};

const addSanction = async () => {
  if (valid.value && selectedUser.value && sanctionReason.value && sanctionDate.value) {
    const selectedUserObj = listausuarios.value.find(user => user.id_usuario === selectedUser.value);
    const formData = {
      Usuarios_id_usuario: selectedUserObj.id_usuario,
      sanc_motivo: sanctionReason.value,
      sanc_evidencia: '',
      sanc_fechaHora: sanctionDate.value};
    try {
      const result = await controller.insertarSancion(formData);
      if (result) {
          sanctions.value.push({
          id_sancion: sanctions.value.length + 1,
          usuario_nombre: `${selectedUserObj.n_completo}`,
          sanc_motivo: sanctionReason.value,
          sanc_fechaHora: sanctionDate.value
        });
        // reset
        selectedUser.value = null;
        sanctionReason.value = '';
        sanctionDate.value = '';
      } else {
        console.error('Error insertando');
      }
    } catch (error) {
      console.error('Error: ', error);
    }
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

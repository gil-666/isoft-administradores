<template>
  <v-progress-circular class="loading-circle" v-if="!isLoaded" color="primary" indeterminate></v-progress-circular>
  <v-container v-if="isLoaded" class="container">


    <!-- Formulario para agregar una sanción -->
    <v-card class="sanction-form data-table">
      <v-card-title class="data-table-title">
        Gestión de Sanciones
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-select v-model="selectedUser" :items="usuariosNombre" item-title="name" item-value="id_usuario"
            label="Selecciona un usuario" placeholder="Usuario sancionado" return-object :rules="[rules.required]" required>
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
    <v-card class="sanction-list data-table">
      <v-card-title class="data-table-title">
        Lista de Sanciones
      </v-card-title>
      <v-data-table :headers="headers" :items="sanctions" class="elevation-1 data-table" item-value="id">
        <template v-slot:item.actions="{ item }">
          <div class="act-btn-container">
            <v-btn class="act-btn" @click="editSanction(item)" color="primary">
              Editar
            </v-btn>
            <v-btn class="act-btn" @click="deleteSanction(item)" color="error">
              Eliminar
            </v-btn>
          </div>
        </template>
        <template v-slot:item.sanc_fechaHora="{ item }">
          {{ fechaCorto(item.sanc_fechaHora) }}
        </template>
      </v-data-table>
    </v-card>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as controller from '../Controller';
import { fechaCorto } from '@/tools';
const valid = ref(false);
const selectedUser = ref('');
const sanctionReason = ref([]);
const sanctionDate = ref('');
const menu = ref(false);
const isLoaded = ref(false);
const datausuarios = ref([]);
const listausuarios = ref([]);
const sanctions = ref([]);
const usuariosNombre = ref([]);
onMounted(async () => {
  isLoaded.value = false;
  try {
    datausuarios.value = await controller.obtenerUsuarios();
    sanctions.value = await controller.obtenerSanciones();
    if (sanctions.value && Array.isArray(sanctions.value)) {
      listausuarios.value = sanctions.value;
    }
    usuariosNombre.value = datausuarios.value.map(user => ({
      name: `${user.n_completo}, Usuario: ${user.n_usuario}`,
      n_completo: user.n_completo,
      id_usuario: user.id_usuario
    }));
    console.log(usuariosNombre.value);
  } catch (error) {
    isLoaded.value = false;
    console.error("Error fetching users:", error);
  } finally {
    isLoaded.value = true;
  }
});






const headers = [
  { title: 'ID', value: 'id_sancion' },
  { title: 'Usuario', value: 'usuario_nombre', sortable: true },
  { title: 'Razón', value: 'sanc_motivo' },
  { title: 'Fecha', value: 'sanc_fechaHora', sortable: true },
  { title: 'Acciones', value: 'actions', sortable: false },
];

const rules = {
  required: value => !!value || 'Este campo es requerido',
};

const addSanction = async () => {
  if (valid.value && selectedUser.value && sanctionReason.value && sanctionDate.value) {
    const formData = {
      Usuarios_id_usuario: selectedUser.value.id_usuario,
      sanc_motivo: sanctionReason.value,
      sanc_evidencia: '',
      sanc_fechaHora: sanctionDate.value
    };
    console.log(formData);
    try {
      const result = await controller.insertarSancion(formData);
      if (result) {
        sanctions.value.push({
          id_sancion: sanctions.value.length + 1,
          usuario_nombre: `${selectedUser.value.n_completo}`,
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

<style src="../assets/main.css" scoped>
.container {
  padding: 20px;
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

.loading-circle {
  text-align: center;
  display: block;
  margin: 0 auto;
}
</style>

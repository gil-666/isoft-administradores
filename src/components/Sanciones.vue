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
            label="Selecciona un usuario" placeholder="Usuario sancionado" return-object :rules="[rules.required]"
            required>
          </v-select>
          <v-text-field v-model="sanctionReason" label="Razón de la sanción" placeholder="Escribe aquí"
            :rules="[rules.required]" required></v-text-field>

          <v-row>
            <v-col>
              <v-text-field v-model="sanctionDateFormatted" label="Fecha de la sanción" readonly
                :rules="[rules.required]" required @click="showDateInput = true" />

              <!-- v-menu component for date picker with offset-y applied -->
              <v-menu v-model="showDateInput" :close-on-content-click="true" transition="scale-transition" offset-y
                v-if="showDateInput">
                <template v-slot:activator="{ props }">
                  <div v-bind="props"></div>
                </template>
                <v-date-picker v-model="sanctionDate" @click="showTimeInput = true" :min="minDate" />
              </v-menu>
            </v-col>
          </v-row>

          <v-menu v-model="showTimeInput" :close-on-content-click="true" transition="scale-transition" offset-y
            v-if="showTimeInput">
            <template v-slot:activator="{ props }">
              <div v-bind="props"></div>
            </template>
            <!-- select hora -->
            <v-time-picker v-model="sanctionTime" @click="updateSanctionDate" format="24hr" />
          </v-menu>

          <v-btn v-if="!isEditing" @click="addSanction" :disabled="!valid" color="success">
            Agregar Sanción
          </v-btn>
          <v-btn v-if="isEditing" @click="updateSanction" :disabled="!valid" color="blue">
            Actualizar Sanción
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
import { fechaCorto, formatDateSQL } from '@/tools';
import { VTimePicker } from 'vuetify/lib/labs/components.mjs';
const minDate = new Date().toISOString().slice(0, 16);
const valid = ref(false);
const isEditing = ref(false);
const selectedUser = ref('');
const selectedSanction = ref('');
const sanctionReason = ref([]);
const sanctionDate = ref(null);
const sanctionDateFormatted = ref(null);
const showTimeInput = ref(false);  // Whether the time picker is shown
const sanctionTime = ref(null);  // The selected time model
const menu = ref(false);
const isLoaded = ref(false);
const datausuarios = ref([]);
const listausuarios = ref([]);
const showDateInput = ref(false);
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
  { title: 'Usuario', value: 'n_completo', sortable: true },
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
      sanc_fechaHora: sanctionDateFormatted.value
    };
    console.log(formData);
    try {
      const result = await controller.insertarSancion(formData);
      if (result) {
        sanctions.value.push({
          id_sancion: sanctions.value.length + 1,
          n_completo: selectedUser.value.n_completo,
          sanc_motivo: sanctionReason.value,
          sanc_fechaHora: sanctionDateFormatted.value
        });
        // reset
        selectedUser.value = null;
        sanctionReason.value = '';
        sanctionDateFormatted.value = '';
      } else {
        console.error('Error insertando');
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  }
};


const editSanction = sanction => {
  console.log(sanction);
  isEditing.value = true;
  selectedSanction.value = sanction;
  selectedUser.value = usuariosNombre.value.find(u => u.name === `${sanction.n_completo}, Usuario: ${sanction.n_usuario}`);
  sanctionReason.value = sanction.sanc_motivo;
  sanctionDateFormatted.value = formatDateSQL(sanction.sanc_fechaHora);
};

const updateSanction = async () => {
  if (valid.value && selectedUser.value && sanctionReason.value && sanctionDate.value) {
    const formData = {
      Usuarios_id_usuario: selectedUser.value.id_usuario,
      sanc_motivo: sanctionReason.value,
      sanc_evidencia: '',
      sanc_fechaHora: sanctionDateFormatted.value,
      id_sancion: selectedSanction.value.id_sancion
    };
    console.log(formData);
    try {
      const result = await controller.actualizarSancion(formData);
      // console.log(result.success);
      if (result) {
        const index = sanctions.value.findIndex(s => s.id_sancion === selectedSanction.value.id_sancion);
        if (index !== -1) {
          sanctions.value[index] = {
            ...sanctions.value[index],
            sanc_motivo: sanctionReason.value,
            sanc_fechaHora: sanctionDateFormatted.value
          };
        }
        // reset
        selectedUser.value = null;
        sanctionReason.value = '';
        sanctionDateFormatted.value = '';
      } else {
        console.error('Error actualizando');
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  }
};

const deleteSanction = async (sanction) => {
  try {
    const result = await controller.eliminarSancion(sanction.id_sancion);
    if (result) {
      sanctions.value = sanctions.value.filter(s => s.id_sancion !== sanction.id_sancion);
    } else {
      console.error('Error eliminando');
    }
  } catch (error) {
    console.error('Error: ', error);
  }
};

const updateSanctionDate = () => {
  if (sanctionDate.value && sanctionTime.value) {
    // Combine date and time
    const date = new Date(sanctionDate.value);
    const [hours, minutes] = sanctionTime.value.split(':');

    date.setHours(hours);
    date.setMinutes(minutes);

    sanctionDateFormatted.value = formatDateSQL(date.toString());
  }
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

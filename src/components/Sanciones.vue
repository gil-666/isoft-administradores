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
              <v-menu v-model="showDateInput" :close-on-content-click="true" transition="scale-transition" offset-y
                v-if="showDateInput">
                <template v-slot:activator="{ props }">
                  <div v-bind="props"></div>
                </template>
                <v-date-picker v-model="sanctionDate" @click="showTimeInput = true" :min="minDate" />
              </v-menu>
            </v-col>
          </v-row>

          <v-menu v-model="showTimeInput" :close-on-content-click="false" transition="scale-transition" offset-y
            v-if="showTimeInput">
            <template v-slot:activator="{ props }">
              <div v-bind="props"></div>
            </template>
            <!-- select hora -->
            <v-time-picker v-model="sanctionTime" @update:model-value="updateSanctionDate" format="24hr" />
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
      <v-data-table :headers="headers" :items="filteredSanciones" class="elevation-1 data-table" item-value="id"
        :search="search">
        <template v-slot:top>

          <v-chip
            @click="$router.push($route.path === '/sanciones' ? '/sanciones' : '/solicitudes'); filtroSelectUsuario = null; filtroSelect = 'Todas'; filtroSelectRecolector = null; search = ''"
            v-if="filtroSelect != 'Todas' || filtroSelectUsuario != null || filtroSelectRecolector != null"
            style="background-color: #007bff; color: white ;max-width: 50%;margin: 0 auto;">Restablecer
            filtro</v-chip><br>
          <v-container class="filter-control">
            <v-col>

              <v-row>
                <v-card-subtitle style="margin: 0 auto;" class="filter-title">Filtros</v-card-subtitle>
              </v-row>
              <v-row style="gap: 10px;">
                <FilterComboBox v-model:selection="filtroSelect" :items="estadofiltros" :filtroSelect="filterModel"
                  :label="'Por estado'" :placeholder="'Filtrar sanciones por estado'"
                  @update:selection="(value) => { console.log(value); filtroSelect = value }" style="max-width: 180px;">
                </FilterComboBox>

                <FilterComboBox v-model:selection="filtroSelectUsuario"
                  :items="[...new Map(sanctions.map(item => [item.id_usuario, item])).values()]"
                  :filtroSelect="filterModelUsuario" :label="'Por usuario'"
                  :placeholder="'Filtrar sanciones por usuario'" :itemtitle="'n_completo'"
                  :itemvalue="'usuario_id_usuario'"
                  @update:selection="(value) => { console.log(value); filtroSelectUsuario = value }"
                  style="min-width: 150px;"></FilterComboBox>

                <!-- <FilterComboBox v-model:selection="filtroSelectRecolector"
                  :items="[...new Map(sanctions.map(item => [item.Sol_usuario_idsol_usuario, item])).values()]"
                  :filtroSelect="filterModelRecolector" :label="'Por solicitud'"
                  :placeholder="'Filtrar sanciones por solicitud de rec.'" :itemtitle="`idsol_usuario`"
                  :itemvalue="'idsol_usuario'"
                  @update:selection="(value) => { console.log(value); filtroSelectRecolector = value }"
                  style="min-width: 150px;"></FilterComboBox> -->
              </v-row>


            </v-col>


            <v-text-field v-model="search" label="Buscar sanciones" append-icon="mdi-magnify"></v-text-field>
          </v-container>
        </template>
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
        <template v-slot:item.sanc_estado="{ item }">
          <div>
            <v-chip
              :color="item.sanc_estado === 'Aplicada' ? 'green' : item.sanc_estado === 'Pendiente' ? 'yellow' : 'yellow'"
              dark @click="item.isEditingEstado = !item.isEditingEstado"
              style="font-weight: bold; text-align: center; color: white; border-radius: 16px; padding: 0 16px; min-width: auto; height: 30px;">
              {{ item.sanc_estado }}
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
                  v-for="option in ['Aplicada', 'Pendiente'].filter(o => o !== item.sanc_estado)" :key="option"
                  @click="() => { item.sanc_estado = option; item.isEditingEstado = false; actualizarEstadoSancion(option, item.id_sancion) }">
                  <v-list-item-title>{{ option }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

          </div>
        </template>
        <template v-slot:item.Sol_usuario_idsol_usuario="{ item }">
          <v-chip v-if="item.Sol_usuario_idsol_usuario"
            @click="router.push(`/solicitudes?idsol_usuario=${item.Sol_usuario_idsol_usuario}`)">Ir a
            solicitud<v-icon small>mdi-open-in-new</v-icon></v-chip>
          <!-- agrega el argumento del id solicitud para iniciar un busqueda -->
          <p v-if="!item.Sol_usuario_idsol_usuario">N/A</p><!--  si la sancion no esta ligada a solicitud (global) -->
        </template>
        <template v-slot:item.sanc_fechaHora="{ item }">
          {{ fechaCorto(item.sanc_fechaHora) }}
        </template>
        <template v-slot:item.sanc_evidencia="{ item }">
          <div>
            <v-img v-if="item.sanc_evidencia" :src="`data:image/jpeg;base64,${item.sanc_evidencia}`" max-width="100"
              max-height="100">
              <template v-slot:placeholder>
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </template>
            </v-img>
            <div v-else>
              N/A
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import * as controller from '../Controller';
import { fechaCorto, formatDateSQL, getCurrentDateTime } from '@/tools';
import { VTimePicker } from 'vuetify/lib/labs/components.mjs';
import FilterComboBox from './elements/FilterComboBox.vue';
import { useRouter } from 'vue-router';
const minDate = new Date().toISOString().slice(0, 16);
const router = useRouter();
const valid = ref(false);
const isEditing = ref(false);
const estadofiltros = ["Pendiente", "Aplicada", "Todas"];
const filtroSelect = ref('Todas');
const filtroSelectUsuario = ref(null);
const filtroSelectRecolector = ref(null);
const search = ref('');
const selectedUser = ref('');
const filterModel = ref('');
const filterModelUsuario = ref('');
const filterModelRecolector = ref('');
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
    sanctionDateFormatted.value = (await getCurrentDateTime()).toString();
    console.log('sanciones', sanctions.value);
    if (sanctions.value && Array.isArray(sanctions.value)) {
      listausuarios.value = sanctions.value;
    }
    usuariosNombre.value = datausuarios.value.map(user => ({
      name: `${user.n_completo}, Usuario: ${user.n_usuario}`,
      n_completo: user.n_completo,
      n_usuario: user.n_usuario,
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


const filteredSanciones = computed(() => { //filtra automaticamente si hay una busqueda general 
  //o si hay argumento para buscar un solo id
  //o si el combobox de filtrar por estado esta seleccionado
  return sanctions.value.filter(item => {
    // console.log("item: ",item)
    const matchesGeneralSearch = search.value || Object.values(item).some(val =>
      val.toString().toLowerCase().includes(search.value.toLowerCase())
    );
    const comboBoxFilter = filtroSelect.value === "Todas" || item.sanc_estado.toString() === filtroSelect.value;
    const comboBoxFilterUsuario = filtroSelectUsuario.value == null || item.usuario_id_usuario === filtroSelectUsuario.value;
    const comboBoxFilterRecolector = filtroSelectRecolector.value == null || item.idsol_usuario === filtroSelectRecolector.value;
    return comboBoxFilter && (comboBoxFilterRecolector && (comboBoxFilterUsuario && (matchesGeneralSearch)));

  });
});
const headers = [
  { title: 'ID', value: 'id_sancion' },
  { title: 'Usuario', value: 'n_completo', sortable: true },
  { title: 'Razón', value: 'sanc_motivo' },
  { title: 'Evidencia', value: 'sanc_evidencia', sortable: false },
  { title: 'Fecha', value: 'sanc_fechaHora', sortable: true },
  { title: 'Estado', value: 'sanc_estado', sortable: true },
  { title: 'Solicitud de usuario', value: 'Sol_usuario_idsol_usuario', sortable: false },
  { title: 'Acciones', value: 'actions', sortable: false },

];

const rules = {
  required: value => !!value || 'Este campo es requerido',
};

const addSanction = async () => {
  try {
    const formData = {
      Usuarios_id_usuario: selectedUser.value.id_usuario,
      sanc_motivo: sanctionReason.value,
      sanc_evidencia: '',
      sanc_fechaHora: sanctionDateFormatted.value,
      sanc_estado: "Aplicada"
    };
    console.log(formData);
    const result = await controller.insertarSancion(formData);
    if (result) {
      sanctions.value.push({
        id_sancion: sanctions.value.length + 1,
        n_completo: selectedUser.value.n_completo,
        n_usuario: selectedUser.value.n_usuario,
        sanc_motivo: sanctionReason.value,
        sanc_fechaHora: sanctionDateFormatted.value,
        sanc_estado: "Aplicada"
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
};


const editSanction = sanction => {
  console.log(sanction);
  isEditing.value = true;
  selectedSanction.value = sanction;
  console.log("searched: " + `${sanction.n_completo}, Usuario: ${sanction.n_usuario}`)
  selectedUser.value = usuariosNombre.value.find(u => u.name === `${sanction.n_completo}, Usuario: ${sanction.n_usuario}`);
  sanctionReason.value = sanction.sanc_motivo;
  sanctionDateFormatted.value = formatDateSQL(sanction.sanc_fechaHora);
};

const updateSanction = async () => {
  if (valid.value && selectedUser.value && sanctionReason.value && sanctionDateFormatted.value) {
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

const updateSanctionDate = async () => {
  if (sanctionDate.value && sanctionTime.value) {
    // Combine date and time
    const date = new Date(sanctionDate.value);
    const [hours, minutes] = sanctionTime.value.split(':');

    date.setHours(hours);
    date.setMinutes(minutes);

    sanctionDateFormatted.value = formatDateSQL(date.toString());
    showTimeInput.value = false;
  }
};

const actualizarEstadoSancion = async (estado, id_sancion) => {
  try {
    const formData = [{
      id_sancion: id_sancion,
      estado: estado
    }]
    await controller.actualizarEstadoSancion(formData);
    console.log(`Estado actualizado a: ${formData[0].estado}`);
  } catch (error) {
    console.error('Error al actualizar estado:', error);
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

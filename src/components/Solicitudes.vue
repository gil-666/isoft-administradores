<template>
  <v-progress-circular class="loading-circle" v-if="!isLoaded" color="primary" indeterminate></v-progress-circular>
  <v-container v-if="isLoaded" class="container ">
    <v-card>
      <v-card-title>
        Solicitudes de Recolección
      </v-card-title>

      <v-data-table :headers="headers" :items="filteredSolicitudes" class="elevation-1 " :search="search">
        <template v-slot:top>
          <v-text-field v-model="search" label="Buscar solicitud general" class="mx-4" append-icon="mdi-magnify"></v-text-field>
          <!-- <v-text-field v-model="idSearch" label="Buscar por ID de Usuario" class="mx-4" append-icon="mdi-account-search"></v-text-field> -->       
          <v-chip @click="router.push('/solicitudes')" v-if="idSearch" style="max-width: 50%;margin: 0 auto;">Restablecer búsqueda (ver todos)</v-chip><br>    
        </template>
        
        <template v-slot:item.sol_fechaDeFinalizacion="{item}"> <!-- si no hay fecha final muestra n/a-->
          <span>{{ item.sol_fechaDeFinalizacion || 'N/A' }}</span>
        </template>

        <template v-slot:item.estado="{ item }">
          <div>
            <!-- Chip that opens the dropdown menu on click -->
            <v-chip :color="item.estado === 'Completado' ? 'green' : item.estado === 'Pendiente' ? 'yellow' : 'red'"
              dark @click="item.isEditingEstado = !item.isEditingEstado"
              style="font-weight: bold; text-align: center; color: white; border-radius: 16px; padding: 0 16px; min-width: auto; height: 30px;">
              {{ item.estado }}
            </v-chip>

            <!-- Dropdown menu for selecting a new state -->
            <v-menu v-model="item.isEditingEstado" close-on-content-click class="custom-menu">
              <v-list>
                <!-- Filter options to exclude the currently selected one -->
                <v-list-item v-for="option in ['Completado', 'Pendiente', 'Cancelado'].filter(o => o !== item.estado)"
                  :key="option" @click="() => { item.estado = option; item.isEditingEstado = false; }">
                  <v-list-item-title>{{ option }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, ref,watch,computed } from 'vue';
import * as controller from '../Controller';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const isLoaded = ref(false);
const data = ref();
const solicitudes = ref([]);
const search = ref('');
const idSearch = ref(route.query.idsol_usuario || ''); //si hay argumentos de busqueda
onMounted(async () => {
  isLoaded.value = false;
  try {
    data.value = await controller.obtenerSolicitudes();
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
watch(
  () => route.query.idsol_usuario,
  (newVal) => {
    idSearch.value = newVal || '';
  }
);

const filteredSolicitudes = computed(() => {
  return solicitudes.value.filter(item => {
    const matchesIdSearch = !idSearch.value || item.idsol_usuario.toString().includes(idSearch.value);
    const matchesGeneralSearch = !search.value || Object.values(item).some(val =>
      val.toString().toLowerCase().includes(search.value.toLowerCase())
    );
    return matchesIdSearch && matchesGeneralSearch;
  });
});

console.log("solicitudes array ", solicitudes);
const headers = ref([
{ title: 'ID', value: 'idsol_usuario' },
  { title: 'Estado', value: 'estado' },
  { title: 'Fecha de Solicitud', value: 'sol_fechaDeSolicitud' },
  { title: 'Fecha de Finalización', value: 'sol_fechaDeFinalizacion' },
  { title: 'Tipo de Solicitud', value: 'sol_tipo' },
  { title: 'Nombre de Usuario', value: 'n_usuario' },
  { title: 'Nombre Completo', value: 'n_completo' },
  { title: 'Nombre de Recolector', value: 'nombre_recolector' },
]);
</script>

<style scoped>
.custom-menu .v-menu__content {
  margin-top: 8px; /* Adds some spacing between the chip and the dropdown */
}

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
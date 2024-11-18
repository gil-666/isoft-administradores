<template>
  <v-progress-circular class="loading-circle" v-if="!isLoaded" color="primary" indeterminate></v-progress-circular>
  <v-container v-if="isLoaded" class="container no-print">
    <v-card class="data-table">
      <v-card-title class="data-table-title">
        Solicitudes de Recolección
      </v-card-title>

      <v-data-table :headers="headers" :items="filteredSolicitudes" class="elevation-1 data-table" :search="search">
        <template v-slot:top>
          <v-text-field v-model="search" v-if="!idSearch" label="Buscar solicitud general" class="mx-4"
            append-icon="mdi-magnify"></v-text-field>
          <v-chip @click="router.push('/solicitudes')" v-if="idSearch"
            style="background-color: #007bff; color: white ;max-width: 50%;margin: 0 auto;">Ver todos</v-chip><br>
        </template>

        <template v-slot:item.sol_fechaDeSolicitud="{ item }"> <!-- si no hay fecha final muestra n/a-->
          <span>{{ fechaCorto(item.sol_fechaDeSolicitud) || 'N/A' }}</span>
        </template>

        <template v-slot:item.estado="{ item }">
          <div>
            <v-chip :color="item.estado === 'Completado' ? 'green' : item.estado === 'Pendiente' ? 'yellow' : 'red'"
              dark @click="item.isEditingEstado = !item.isEditingEstado"
              style="font-weight: bold; text-align: center; color: white; border-radius: 16px; padding: 0 16px; min-width: auto; height: 30px;">
              {{ item.estado }}
            </v-chip>
            <!-- menu dropdown-->
            <v-menu v-model="item.isEditingEstado" close-on-content-click class="custom-menu ">
              <template v-slot:activator="{ props }">
                <!-- asegura que el menu este vinculado al v-chip -->
                <div  v-bind="props"></div>
              </template>
              <v-list :bg-color="darkTheme ? '#333' : 'white'" class="data-table">
                <!-- excluir la actualmente seleccionada -->
                <v-list-item class="data-table" v-for="option in ['Completado', 'Pendiente', 'Cancelado'].filter(o => o !== item.estado)"
                  :key="option"
                  @click="() => { item.estado = option; item.isEditingEstado = false; actualizarEstadoRecoleccion(option, item.idsol_usuario) }">
                  <v-list-item-title>{{ option }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

          </div>
        </template>
        <template v-slot:item.details="{ item }">
          <v-chip @click="triggerOverlay(item)">Ver detalles<v-icon small>mdi-open-in-new</v-icon></v-chip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
  <div v-if="isVisible" class="overlay" @click="hideOverlay">
    <InfoDialog :data="selectedItem" @hideOverlay="hideOverlay"></InfoDialog>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import * as controller from '../Controller';
import { useRoute, useRouter } from 'vue-router';
import InfoDialog from './SolicitudInfo.vue';
import { fechaCorto } from '@/tools';
const route = useRoute();
const router = useRouter();
const darkTheme = ref(window.matchMedia('(prefers-color-scheme: dark)').matches);
const isLoaded = ref(false);
const data = ref();
const solicitudes = ref([]);
const search = ref('');
const idSearch = ref(route.query.idsol_usuario || ''); //si hay argumentos de busqueda

//CUADRO DE DIALOGO
const isVisible = ref(false);
function triggerOverlay(item) {
  selectedItem.value = item;
  isVisible.value = true;
};
const hideOverlay = () => (isVisible.value = false);
const selectedItem = ref([]);

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

const filteredSolicitudes = computed(() => { //filtra automaticamente si hay una busqueda general 
  //o si hay argumento para buscar un solo id
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
  { title: 'Tipo de Solicitud', value: 'sol_tipo' },
  { title: 'Nombre Completo', value: 'n_completo' },
  { title: 'Fecha de Solicitud', value: 'sol_fechaDeSolicitud' },
  // { title: 'Fecha de Finalización', value: 'sol_fechaDeFinalizacion' },
  // { title: 'Nombre de Usuario', value: 'n_usuario' },
  { title: 'Estado', value: 'estado' },
  { title: 'Comentario', value: 'details' }
  // { title: 'Nombre de Recolector', value: 'nombre_recolector' },
]);

const actualizarEstadoRecoleccion = async (estado, idsol_usuario) => {
  try {
    const formData = [{
      idsol_usuario: idsol_usuario,
      estado: estado
    }]
    await controller.actualizarEstadoRecoleccion(formData);
    console.log(`Estado actualizado a: ${formData[0].estado}`);
  } catch (error) {
    console.error('Error al actualizar estado:', error);
  }
};

</script>

<style src="../assets/main.css" scoped>
/* .custom-menu {
  margin-top: 25%;
  margin-left: 35%;
} */

.container {
  padding: 20px;
  /* background-color: #f9f9f9; */
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
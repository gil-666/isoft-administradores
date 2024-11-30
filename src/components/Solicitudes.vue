<template>
  <v-progress-circular class="loading-circle" v-if="!isLoaded" color="primary" indeterminate></v-progress-circular>
  <v-container v-if="isLoaded" class="container no-print">
    <v-card class="data-table">
      <v-card-title class="data-table-title">
        Solicitudes de Recolección
      </v-card-title>

      <v-data-table :headers="headers" :items="filteredSolicitudes" class="elevation-1 data-table" :search="search">

        <template v-slot:top>
          
          <v-chip
            @click="$router.push($route.path === '/rutas' ? '/rutas' : '/solicitudes'); filtroSelectUsuario = null; filtroSelect = 'Todas'; filtroSelectRecolector = null; search = ''"
            v-if="idSearch || filtroSelect != 'Todas' || filtroSelectUsuario != null || filtroSelectRecolector != null"
            style="background-color: #007bff; color: white ;max-width: 50%;margin: 0 auto;">Restablecer
            filtro</v-chip><br>
            <v-container class="filter-control">
          <v-col v-if="!idSearch">
            
              <v-row>
                <v-card-subtitle style="margin: 0 auto;" class="filter-title">Filtros</v-card-subtitle>
              </v-row>
              <v-row style="gap: 10px;">
                <FilterComboBox v-model:selection="filtroSelect" :items="estadofiltros" :filtroSelect="filterModel"
                  :label="'Por estado'" :placeholder="'Filtrar solicitudes por estado'"
                  @update:selection="(value) => { console.log(value); filtroSelect = value }" style="max-width: 180px;">
                </FilterComboBox>

                <FilterComboBox v-model:selection="filtroSelectUsuario"
                  :items="[...new Map(solicitudes.map(item => [item.usuario_id_usuario, item])).values()]"
                  :filtroSelect="filterModelUsuario" :label="'Por usuario'"
                  :placeholder="'Filtrar solicitudes por usuario'" :itemtitle="'n_completo'"
                  :itemvalue="'usuario_id_usuario'"
                  @update:selection="(value) => { console.log(value); filtroSelectUsuario = value }"
                  style="min-width: 150px;"></FilterComboBox>

                <FilterComboBox v-model:selection="filtroSelectRecolector"
                  :items="[...new Map(solicitudes.map(item => [item.usuarios_id_usuario, item])).values()]"
                  :filtroSelect="filterModelRecolector" :label="'Por recolector'"
                  :placeholder="'Filtrar solicitudes por recolector'" :itemtitle="'nombre_recolector'"
                  :itemvalue="'usuarios_id_usuario'"
                  @update:selection="(value) => { console.log(value); filtroSelectRecolector = value }"
                  style="min-width: 150px;"></FilterComboBox>
              </v-row>
            

          </v-col>
        
        
          <v-text-field v-model="search" v-if="!idSearch" label="Buscar solicitud general"
            append-icon="mdi-magnify"></v-text-field>
          </v-container>
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
                <div v-bind="props"></div>
              </template>
              <v-list :bg-color="darkTheme ? '#333' : 'white'" class="data-table">
                <!-- excluir la actualmente seleccionada -->
                <v-list-item class="data-table"
                  v-for="option in ['Completado', 'Pendiente', 'Cancelado'].filter(o => o !== item.estado)"
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
import { fechaCorto, mayusOracion } from '@/tools';
import FilterComboBox from './elements/FilterComboBox.vue';
const solicitudes = ref([]);
const route = useRoute();
const router = useRouter();
const filterModel = ref('');
const filterModelUsuario = ref('');
const filterModelRecolector = ref('');
const estadofiltros = ["Todas", "Cancelado", "Pendiente", "Completado"];
const filtroSelect = ref('Todas');
const filtroSelectUsuario = ref(null);
const filtroSelectRecolector = ref(null);
const darkTheme = ref(window.matchMedia('(prefers-color-scheme: dark)').matches);
const isLoaded = ref(false);
const data = ref();

const search = ref('');
const idSearch = ref(route.query.idsol_usuario || ''); //si hay argumentos de busqueda

console.log(filtroSelect);
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
    //limpieza de datos
    for (let index = 0; index < data.value.length; index++) { //es importante que el estado este en forma oración si no los estados de la tabla no funcionan
      data.value[index].estado = mayusOracion(data.value[index].estado);
    }
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
  //o si el combobox de filtrar por estado esta seleccionado
  return solicitudes.value.filter(item => {
    // console.log("item: ",item)
    const matchesIdSearch = !idSearch.value || item.idsol_usuario.toString() === (idSearch.value);
    const matchesGeneralSearch = search.value || Object.values(item).some(val =>
      val.toString().toLowerCase().includes(search.value.toLowerCase())
    );
    const comboBoxFilter = filtroSelect.value === "Todas" || item.estado.toString() === filtroSelect.value;
    const comboBoxFilterUsuario = filtroSelectUsuario.value == null || item.usuario_id_usuario === filtroSelectUsuario.value;
    const comboBoxFilterRecolector = filtroSelectRecolector.value == null || item.usuarios_id_usuario === filtroSelectRecolector.value;
    return comboBoxFilter && (comboBoxFilterRecolector && (comboBoxFilterUsuario && (matchesIdSearch && matchesGeneralSearch)));

  });
});

console.log("solicitudes array ", solicitudes);
const headers = ref([
  { title: 'ID', value: 'idsol_usuario' },
  { title: 'Tipo de Solicitud', value: 'sol_tipo', sortable: true },
  { title: 'Nombre Completo', value: 'n_completo', sortable: true },
  { title: 'Fecha de Solicitud', value: 'sol_fechaDeSolicitud', sortable: true },
  // { title: 'Fecha de Finalización', value: 'sol_fechaDeFinalizacion' },
  // { title: 'Nombre de Usuario', value: 'n_usuario' },
  { title: 'Nombre de Recolector', value: 'nombre_recolector' },
  { title: 'Estado', value: 'estado', sortable: true },
  { title: '', value: 'details' }

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

<style src="../assets/main.css" scoped></style>
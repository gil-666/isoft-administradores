<template>
  <v-progress-circular class="loading-circle" v-if="!isLoaded" color="primary" indeterminate></v-progress-circular>
  <v-container v-if="isLoaded" class="container ">
    <v-card class="data-table">
      <v-card-title class="data-table-title">
        Recompensas
      </v-card-title>

      <v-data-table :headers="headers" :items="filteredRecompensas" class="elevation-1 data-table" :search="search">
        <template v-slot:top>
          <v-chip
            @click="$router.push($route.path === '/recompensas' ? '/recompensas' : '/solicitudes'); filtroSelectUsuario = null; filtroSelect = 'Todas'; filtroSelectRecolector = null; search = ''"
            v-if=" filtroSelect != 'Todas' || filtroSelectUsuario != null || filtroSelectRecolector != null"
            style="background-color: #007bff; color: white ;max-width: 50%;margin: 0 auto;">Restablecer
            filtro</v-chip><br>
          <v-container class="filter-control">
            <v-col>

              <v-row>
                <v-card-subtitle style="margin: 0 auto;" class="filter-title">Filtros</v-card-subtitle>
              </v-row>
              <v-row style="gap: 10px;">
                <FilterComboBox v-model:selection="filtroSelect" :items="estadofiltros" :filtroSelect="filterModel"
                  :label="'Por planta'" :placeholder="'Filtrar recompensas por planta'" :itemtitle="'nombrePlanta'" :itemvalue="'idPlantas'"
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
                  :items="rutasfiltros2"
                  :filtroSelect="filterModelRecolector" :label="'Por ruta'"
                  :placeholder="'Filtrar recompensas por ruta'" :itemtitle="'ruta'"
                  :itemvalue="'idsol_usuario'"
                  @update:selection="(value) => { console.log(value); filtroSelectRecolector = value }"
                  style="min-width: 150px;"></FilterComboBox>
              </v-row>


            </v-col>
            <v-text-field v-model="search" label="Buscar solicitudes de recompensas" class="mx-4"
              append-icon="mdi-magnify"></v-text-field>
          </v-container>
        </template>
        <template v-slot:item.Fecha="{ item }">
          {{ fechaCorto(item.Fecha) }}
        </template>
        <!-- boton 'ir a solicitud' -->
        <template v-slot:item.idsol_recoleccion="{ item }">
          <v-chip @click="router.push(`/solicitudes?idsol_usuario=${item.Sol_usuario_idsol_usuario}`)">Ir a
            solicitud<v-icon small>mdi-open-in-new</v-icon></v-chip>
          <!-- agrega el argumento del id solicitud para iniciar un busqueda -->
        </template>

      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import * as controller from '../Controller';
import { useRoute, useRouter } from 'vue-router';
import { fechaCorto } from '@/tools';
import FilterComboBox from './elements/FilterComboBox.vue';
const isLoaded = ref(false);
const data = ref();
const filtroSelectUsuario = ref(null);
const estadofiltros = ref([]);
const filtroSelect = ref('Todas');
const rutasfiltros = ref([]);
const rutasfiltros2 = ref([]);
const filtroSelectRecolector = ref(null);
const solicitudes = ref([]);
const search = ref('');
const router = useRouter();
onMounted(async () => {
  isLoaded.value = false;
  try {
    data.value = await controller.obtenerRecompensas();
    estadofiltros.value = await controller.obtenerPlantas();
    rutasfiltros.value = await controller.obtenerRutas();
    rutasfiltros2.value = rutasfiltros.value.map(r => ({
      ruta: `Sol ID:${r.idsol_usuario}, ${r.n_completo}, Domicilio: ${r.direccion_completa.split(',')[0]}`,
      n_completo: r.n_completo,
      idsol_usuario: r.idsol_usuario,
      sol_tipo: r.sol_tipo
    }));
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

console.log("solicitudes array ", solicitudes);
console.log("plantas array ", estadofiltros);
console.log("rutas array ", rutasfiltros);
const headers = ref([
  { title: 'ID', value: 'Idsol_plantas' },
  { title: 'Nombre Completo', value: 'n_completo', sortable: true },
  { title: 'Nombre de planta', value: 'nombrePlanta', sortable: true },
  { title: 'Cantidad de puntos', value: 'puntosRequeridos', sortable: true },
  { title: 'Fecha y hora', value: 'Fecha', sortable: true },
  { title: 'Comentario', value: 'comentario' },
  { title: 'Solicitud de usuario', value: 'idsol_recoleccion' },
]);

const filteredRecompensas = computed(() => { //filtra automaticamente si hay una busqueda general 
  //o si hay argumento para buscar un solo id
  //o si el combobox de filtrar por estado esta seleccionado
  return solicitudes.value.filter(item => {
    // console.log("item: ",item)
    const matchesGeneralSearch = search.value || Object.values(item).some(val =>
      val.toString().toLowerCase().includes(search.value.toLowerCase())
    );
    const comboBoxFilter = filtroSelect.value === "Todas" || item.idPlantas === filtroSelect.value;
    const comboBoxFilterUsuario = filtroSelectUsuario.value == null || item.usuario_id_usuario === filtroSelectUsuario.value;
    const comboBoxFilterRecolector = filtroSelectRecolector.value == null || item.idsol_usuario === filtroSelectRecolector.value;
    return comboBoxFilter && (comboBoxFilterRecolector && (comboBoxFilterUsuario && (matchesGeneralSearch)));

  });
});
</script>

<style src="../assets/main.css" scoped>
/* .custom-table .v-data-table-header th {
    color: black !important;
    font-weight: bold;
    text-align: center;
  } */

.container {
  padding: 20px;
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
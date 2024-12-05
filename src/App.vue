<script setup>
import { ref, onMounted, watch } from 'vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Suspense } from 'vue';
import InfoDialog from './components/SolicitudInfo.vue';
import { obtenerLOC } from './Controller';
import Header from './components/Header.vue';
const router = useRouter();
const authToken = ref(localStorage.getItem('auth_token'));
const loc = ref();
const isLoaded = ref(false);

async function getLOC() {
  loc.value = await obtenerLOC();
  isLoaded.value = true;
}
onMounted(async () => {
  getLOC()
});

//cerrar sesion, vaciar almacenamiento local y borrar cookies (si hay)
const logout = () => {
  localStorage.clear()
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  authToken.value = null;

  router.push('/');
};


</script>
<template>

  <Header :authToken="authToken" @logout="logout"></Header>

  <!-- aqui empieza el contenido -->
  <main>
    
    
    
    <!-- el router es el que cambia el componente que esta en vista -->
    <Suspense>

      <!-- suspense es un componente que hace que la app primero espere a terminen de correr las funciones asincronas antes de render la interfaz -->
      <template #default>
        <router-view />

      </template>

      <template #fallback>
        <v-progress-circular color="primary" indeterminate></v-progress-circular>
      </template>
    </Suspense>

  </main>
  <footer>Administradores | Recoleccion de basura <br> Ingenieria de Software 2024B <br><p>lineas de codigo totales (git): <v-chip color="blue"><v-progress-circular v-if="!isLoaded" style="width: 20px;" color="primary" indeterminate></v-progress-circular>{{ loc }}</v-chip></p> <br> Hecho en <img title="Vue" src="./assets/logo.svg" width="15px" alt=""></footer>
</template>

<style scoped>
.hidden {
  display: none;
}
</style>

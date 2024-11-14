<script setup>
import { ref, onMounted, watch } from 'vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Suspense } from 'vue';

import Header from './components/Header.vue';
const router = useRouter();
const authToken = ref(localStorage.getItem('auth_token'));


//cerrar sesion, vaciar almacenamiento local y borrar cookies (si hay)
const logout = () => {

  localStorage.removeItem('auth_token');
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
          <router-view  />
        
      </template>

      <template #fallback>
        <v-progress-circular color="primary" indeterminate></v-progress-circular>
      </template>
    </Suspense>

  </main>
</template>

<style scoped>
.hidden {
  display: none;
}
</style>

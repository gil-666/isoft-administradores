<script setup>
import { ref,onMounted,watchEffect } from 'vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import Header from './components/Header.vue';
const router = useRouter();

</script>
<template>
  <Header></Header>
  <!-- header -->
  <!--
  <header>
    <div class="logo-div">
      <a class="logo" href="/">
        <h1 style="font-weight: 500;">Administradores</h1>
        <img class="logo" style="color: blue;" width="20px" height="20px" src="./assets/recycle.png">
      </a>
    </div>
    <div class="header-buttons">
      
    </div>
    <v-divider vertical></v-divider>
    <div class="login-setting">
      <p>Hola, usuario</p>
      <a class="button" href="/login">Iniciar sesión</a>
      
    </div>

  </header>
-->
  <!-- aqui empieza el contenido -->
  <main>
    <!-- el router es el que cambia el componente que esta en vista -->
    <suspense>
      <!-- suspense es un componente que hace que la app primero espere a terminen de correr las funciones asincronas antes de render la interfaz -->
      <router-view />
    </suspense>

  </main>
</template>

<style scoped>
.hidden {
  display: none;
}
</style>

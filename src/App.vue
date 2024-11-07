<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const isLoggedIn = ref(false);
onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('auth_token');
});
watch(() => localStorage.getItem('auth_token'), (newValue) => {
  isLoggedIn.value = !!newValue;
}, { immediate: true });
const logout = () => {
  localStorage.removeItem('auth_token');

  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'; 
  isLoggedIn.value = false;
  router.push('/');

};

</script>
<template>
  <header class="header">
    <nav class="nav-container">
      <div class="logo-container">
        <img src="/src/assets/admin.png" alt="Logo" class="logo-icon" />
        <a  style="background: unset; border: unset; box-shadow: unset;" href="/menu"><h1 class="logo-text">Administracion</h1></a>
          
      </div>
      <ul class="nav-links">
        <li>
          <a href="/solicitudes">
            <img src="/src/assets/solicitud-de-amistad.png" alt="Solicitudes" class="nav-icon" />
            Solicitudes
          </a>
        </li>
        <li>
          <a href="/sanciones">
            <img src="/src/assets/juicio.png" alt="Sanciones" class="nav-icon" />
            Sanciones
          </a>
        </li>
        <li>
          <a href="/" class="highlight-red">
            <img src="/src/assets/fertilizante.png" alt="Producción" class="nav-icon" />
            Producción
          </a>
        </li>
        <li>
          <a href="/" class="highlight-red">
            <img src="/src/assets/rec.png" alt="Recompensas" class="nav-icon" />
            Recompensas
          </a>
        </li>
        <li>
          <a href="/usuarios">
            <img src="/src/assets/usuario.png" alt="Usuarios" class="nav-icon" />
            Usuarios
          </a>
          
        </li>
        <li>
          <img src="/src/assets/cerrar-sesion.png" alt="Usuarios" class="nav-icon" />
        <button v-if="isLoggedIn" @click="logout" class="logout-button">Cerrar Sesión</button>
      </li>
      </ul>
      
    </nav>
   
  </header>
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

</style>

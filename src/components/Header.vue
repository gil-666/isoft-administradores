<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

// Define the router instance for navigation
const router = useRouter();

// Reactive variable to track authentication token from local storage
const authToken = ref(localStorage.getItem('auth_token'));

// Update `authToken` in localStorage whenever it changes
watchEffect(() => {
  if (authToken.value) {
    localStorage.setItem('auth_token', authToken.value);
  } else {
    localStorage.removeItem('auth_token');
  }
});

// Define `isLoggedIn` based on `authToken` to track login status
const isLoggedIn = ref(!!authToken.value);

// Logout method to clear token and redirect to home
const logout = () => {
  // Remove auth token from localStorage and cookies
  localStorage.removeItem('auth_token');
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  
  // Set `isLoggedIn` to false to hide protected UI and navigate home
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
        
      </ul>
      
    </nav>
    <button v-if="isLoggedIn" @click="logout" class="logout-button">Cerrar Sesión</button>
  </header>
</template>
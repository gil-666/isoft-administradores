<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

// Define the router instance for navigation
const router = useRouter();
const props = defineProps({
  authToken: String
});
const emit = defineEmits(['logout']);
const isLoggedIn = computed(() => !!props.authToken);

const handleLogout = () => {
  emit('logout');
};
</script>
<template>

  <header v-if="isLoggedIn" class="header no-print">
    <nav class="nav-container">
      <div class="logo-container">
        <img src="/src/assets/admin.png" alt="Logo" class="logo-icon" />
        <a style="background: unset; border: unset; box-shadow: unset;" href="/menu">
          <h1 class="logo-text">Administracion</h1>
        </a>

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
          <a href="/produccion" class="highlight-red">
            <img src="/src/assets/fertilizante.png" alt="Producción" class="nav-icon" />
            Producción
          </a>
        </li>
        <li>
          <a href="/recompensas" class="highlight-red">
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
          <button @click="handleLogout" class="logout-button">
            <img src="/src/assets/cerrar-sesion.png" alt="logout" class="nav-icon" />
            Cerrar Sesión
          </button>



        </li>
      </ul>

    </nav>

  </header>
</template>

<style scoped>

</style>
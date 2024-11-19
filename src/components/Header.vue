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
      <input type="checkbox" id="menu-toggle" class="menu-toggle" />
      <label for="menu-toggle" class="hamburger-menu">
        <v-icon small>mdi-menu</v-icon>
      </label>
      <div class="logo-container">

        <img src="/src/assets/admin.png" alt="Logo" class="logo-icon" />
        <a class="logo-link" style="background: unset; border: unset; box-shadow: unset;" href="/menu">

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
.menu-toggle {
  display: none;
  width: 100%;
  height: 100%;
}

.hamburger-menu {
  display: none;
  cursor: pointer;
  width: 10%;
  height: 100%;
}

@media(max-width:1024px) {
  .hamburger-menu {
    display: block;
    width: 40px;
  }

  .nav-container {
    display: flex;
    width: 100%;
  }

  .logo-container {
    width: 100%;
    place-items: center;
  }

  .nav-links {
    display: block;
    position: fixed;
    background-color: #2c3e50;
    z-index: 7;
    padding: 0 10px;
    border-radius: 20px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    max-height: 0;
    top: 68px;
    left: 16px;
    place-items: start;
    overflow: hidden;
    pointer-events: none;
    transition: max-height 0.3s ease, padding 0.3s ease;
  }

  li {
    margin-left: 2px;
    padding: 10px;
  }

  .header {
    height: fit-content;
    text-align: start;
    /* width: fit-content; */
  }

  .menu-toggle:checked~.nav-links {
    max-height: 500px;
    padding: 10px;
    pointer-events: auto;
  }

  .menu-toggle:checked~.hamburger-menu {
    color: rgb(255, 174, 0);
  }

  .nav-links:hover { /* para que los links se mantengan abiertos cuando le pones mouse encima*/
    max-height: 500px;
    padding: 10px;
    pointer-events: auto;
  }

  @media (hover: hover) { /* SOLO SE APLICA EN MOVIL*/
    .nav-links {
      pointer-events: auto;
    }
    .menu-toggle:hover ~ .nav-links,
    .menu-toggle:focus ~ .nav-links {
      pointer-events: auto;
    }
  }

  @media (hover: none) { /* SOLO SE APLICA EN PC*/
    .menu-toggle:hover ~ .nav-links,
    .menu-toggle:focus ~ .nav-links {
      max-height: 500px;
      padding: 10px;
      pointer-events: auto;
    }
  }

}
</style>
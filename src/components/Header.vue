<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usuarioActual } from '@/main';

// Define the router instance for navigation
const router = useRouter();
const props = defineProps({
  authToken: String
});
const emit = defineEmits(['logout']);
const isLoggedIn = computed(() => !!props.authToken);
const menuChecked = ref(false);

const handleLogout = () => {
  emit('logout');
};


</script>
<template>

  <header v-if="isLoggedIn" class="header no-print">
    <nav class="nav-container">
      <input type="checkbox" id="menu-toggle" class="menu-toggle" v-model="menuChecked" />
      <label for="menu-toggle" class="hamburger-menu">
        <v-icon small>mdi-menu</v-icon>
        <p class="info">{{ menuChecked ? 'presiona para desfijar menú' : 'presiona para fijar el menú' }}</p>
      </label>

      <div class="logo-container">
        <router-link to="/usuario" class="logo-link"
          style="background: unset; border: unset; box-shadow: unset; padding: 0;">
        <v-avatar size="50" class="me-4">

          <v-img :src="usuarioActual.foto ? 'data:image/jpeg;base64,' + usuarioActual.foto : './src/assets/admin.png'"
            alt="Foto de perfil" class="logo-icon" style="place-items: center;"></v-img>
        </v-avatar>
        </router-link>

        <router-link to="/menu" class="logo-link"
        style="background: unset; border: unset; box-shadow: unset; padding: 0;">
        <h1 class="logo-text">Administración<p class="logo-subtext">Hola, {{ usuarioActual.usuario }}</p>
        </h1>
      </router-link>

      </div>

      <ul class="nav-links">
        <br>

        <li>
          <router-link to="/solicitudes">
            <img src="/src/assets/solicitud-de-amistad.png" alt="Solicitudes" class="nav-icon" />
            Solicitudes
          </router-link>
        </li>
        <li>
          <router-link to="/sanciones">
            <img src="/src/assets/juicio.png" alt="Sanciones" class="nav-icon" />
            Sanciones
          </router-link>
        </li>
        <li>
          <router-link to="/produccion" class="highlight-red">
            <img src="/src/assets/fertilizante.png" alt="Producción" class="nav-icon" />
            Producción
          </router-link>
        </li>
        <li>
          <router-link to="/rutas" class="highlight-red">
            <img src="/src/assets/route.png" alt="Rutas" class="nav-icon" />
            Rutas
          </router-link>
        </li>
        <li>
          <router-link to="/recompensas" class="highlight-red">
            <img src="/src/assets/rec.png" alt="Recompensas" class="nav-icon" />
            Recompensas
          </router-link>
        </li>
        <li>
          <router-link to="/usuarios">
            <img src="/src/assets/usuario.png" alt="Usuarios" class="nav-icon" />
            Usuarios
          </router-link>
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
.info {
  display: block;
  position: fixed;
  z-index: 10;
  text-align: center;
  margin-top: 15px;
  margin-left: -10px;
  font-size: 10pt;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.nav-container {
  overflow: visible;
}

.v-responsive {
  /* para que no se recorte el imagen en el header */
  position: unset;

}

.hamburger-menu:hover .info {
  /* position: fixed; */
  /* z-index: 10; */
  opacity: 1;
  pointer-events: auto;
  transition: opacity 0.5s ease;
}

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

.highlight {
  background-color: rgb(0, 109, 7);
  border-radius: 10px;
}

.highlight .nav-links:hover {
  background-color: rgb(0, 109, 7);
}

.logo-text {
  display: block;
  line-height: 20pt;
}

.logo-subtext {
  font-size: 10pt;
  font-style: normal;
  pointer-events: none;
  text-decoration: unset;
  max-width: 190px;
  color: white;
  line-break: strict;
  overflow: hidden;
  /* Hide the overflowing text */
  white-space: nowrap;
  /* Prevent the text from wrapping to a new line */
  text-overflow: ellipsis;
  /* text-wrap: wrap; */
  /* line-height: 11pt; */
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
    z-index: 3;
    display: inline-flex;

  }

  .nav-links {
    display: block;
    position: fixed;
    background-color: #2c3e50;
    /* background-color: #02ff41; */
    z-index: 1;
    padding: 0 10px;
    border-radius: 20px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    max-height: 0;
    top: 60px;
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

  .nav-links:hover {
    /* para que los links se mantengan abiertos cuando le pones mouse encima*/
    max-height: 500px;
    padding: 10px;
    pointer-events: auto;
  }

  @media (hover: hover) {

    /* SOLO SE APLICA EN PC*/
    .hamburger-menu:hover~.nav-links,
    .menu-toggle:hover~.nav-links,
    .menu-toggle:focus~.nav-links {
      max-height: 500px;
      padding: 10px;
      pointer-events: auto;
    }


  }

  @media (hover: none) {

    /* SOLO SE APLICA EN MOVIL*/
    .nav-links {
      pointer-events: auto;
    }

    .menu-toggle:hover~.nav-links,
    .menu-toggle:focus~.nav-links {
      pointer-events: auto;
    }
  }

}
</style>
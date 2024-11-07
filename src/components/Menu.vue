<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

onMounted(() => {

  const authToken = localStorage.getItem('auth_token');

  if (authToken) {
    router.push('/menu');  // Redirect to menu if token exists
  } else {
    router.push('/');  // Redirect to login if no token
  }
});
</script>

<template>
 <div class="container" style="border-radius: 20px;">
  <h1>Bienvenido</h1>
 </div>
 
</template>

<style scoped>
/* Estilos del header y navegación */
/* Estilos del header y navegación */
.header {
  background-color: #2c3e50;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #ecf0f1;
  position: fixed; /* Fija el header en la parte superior */
  top: 0; /* Posición en la parte superior */
  left: 0; /* Alinea a la izquierda */
  width: 100%; /* Ocupa todo el ancho de la pantalla */
  z-index: 1000; /* Asegura que el header esté por encima de otros elementos */
}


.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #ecf0f1;
}

.nav-links {
  display: flex;
  list-style: none;
}

.nav-links li {
  margin-left: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #ecf0f1;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.nav-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.highlight-red {
  color: #e74c3c;
}
</style>

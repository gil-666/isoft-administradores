<script setup>
import { onMounted, ref } from 'vue';

const usuarioActual = {
  nombre: localStorage.getItem("n_completo") || 'Nombre no disponible',
  usuario: localStorage.getItem("n_usuario") || 'Usuario no disponible',
  correo: localStorage.getItem("n_correo") || 'Correo no disponible',
  telefono: localStorage.getItem("admin_tel") || 'Teléfono no disponible',
  foto: localStorage.getItem("admin_foto") || 'https://via.placeholder.com/150',
  tipo: localStorage.getItem("tipo") || 'Tipo no especificado'
};

const usuario = ref({ ...usuarioActual });

onMounted(() => {
  console.log('Datos del usuario:', usuario.value); // Debug: Eliminar en producción.
});
</script>

<template>
  <v-container class="user-container">
    <v-card class="mx-auto" max-width="344" outlined>
      <v-img :src="usuario.foto" height="200px"></v-img>
      <v-card-title>{{ usuario.nombre }}</v-card-title>
      <v-card-subtitle>{{ usuario.usuario }}</v-card-subtitle>
      <v-card-text>
        <p>Correo: {{ usuario.correo }}</p>
        <p>Teléfono: {{ usuario.telefono }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.user-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>

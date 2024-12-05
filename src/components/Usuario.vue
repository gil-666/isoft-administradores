<template>
  <v-container class="py-5">
    <v-card class="mx-auto my-5" max-width="500">
      <v-card-title>
        <!-- Avatar de usuario -->
        <v-avatar size="60" class="me-3">
          <v-img :src="usuario.foto" alt="Foto de perfil"></v-img>
        </v-avatar>
        <div>
          <h3 class="mb-1">{{ usuario.nombre }}</h3>
          <p class="text-muted">@{{ usuario.usuario }}</p>
        </div>
      </v-card-title>
      <v-card-text>
        <!-- Lista con los datos del usuario -->
        <v-list>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-email</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ usuario.correo }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-phone</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ usuario.telefono }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { usuarioActual } from '@/main';

// Objeto usuario que toma los datos de usuarioActual del localStorage
const usuario = {
  nombre: usuarioActual.nombre || 'Nombre no disponible',
  usuario: usuarioActual.usuario || 'Usuario no disponible',
  correo: usuarioActual.correo || 'Correo no disponible',
  telefono: usuarioActual.telefono || 'Teléfono no disponible',
  foto: usuarioActual.foto || 'https://via.placeholder.com/150'  // Imagen por defecto
};
</script>

<style scoped>
/* Estilos para personalizar la apariencia de la tarjeta */
.v-card {
  background-color: #f5f5f5;
  border-radius: 10px;
}
</style>

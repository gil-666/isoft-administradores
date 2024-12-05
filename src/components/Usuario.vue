<template>
    <v-container class="py-5">
      <v-card class="mx-auto my-5" max-width="500">
        <v-card-title>
          <v-avatar size="90" class="me-3">
            <v-img :src="usuario.foto ? 'data:image/jpeg;base64,' + usuario.foto : '/src/assets/admin.png'" alt="Foto de perfil"></v-img>
          </v-avatar>
          <div>
            <h3 class="mb-1">{{ usuario.nombre }}</h3>
            <p class="text-muted">@{{ usuario.usuario }}</p>
          </div>
        </v-card-title>
        <v-card-text>
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
import { ref } from 'vue';

const usuario = ref({
  nombre: usuarioActual.nombre.replace(/"/g,'') || 'Nombre no disponible',
  usuario: usuarioActual.usuario.replace(/"/g,'') || 'Usuario no disponible',
  correo: usuarioActual.correo.replace(/"/g,'') || 'Correo no disponible',
  telefono: usuarioActual.telefono.replace(/"/g,'') || 'Teléfono no disponible',
  foto: usuarioActual.foto.replace(/"/g,'') || 'https://via.placeholder.com/150'
});

console.log(usuario);  // Verificar si el objeto 'usuario' se está llenando correctamente


  </script>
  
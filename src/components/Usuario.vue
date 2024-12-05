<template>
    <v-container class="py-5">
      <v-card class="mx-auto my-5" max-width="500">
        <v-card-title>
          <v-avatar size="60" class="me-3">
            <v-img :src="usuario.foto" alt="Foto de perfil"></v-img>
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

const usuario = {
  nombre: usuarioActual.nombre || 'Nombre no disponible',
  usuario: usuarioActual.usuario || 'Usuario no disponible',
  correo: usuarioActual.correo || 'Correo no disponible',
  telefono: usuarioActual.telefono || 'Teléfono no disponible',
  foto: usuarioActual.foto || 'https://via.placeholder.com/150'
};

console.log(usuario);  // Verificar si el objeto 'usuario' se está llenando correctamente


  </script>
  
<template>
  <v-container class=" container" style="background-color: unset;">
    <v-card class="mx-auto my-5 data-table" max-width="500">
      <v-card-title>
        <v-avatar size="90" class="me-3">
          <v-img :src="usuario.foto ? 'data:image/jpeg;base64,' + usuario.foto : '/src/assets/admin.png'"
            alt="Foto de perfil"></v-img>
        </v-avatar>
        <v-card-text>
          <v-btn @click="selectImage" color="primary">Cambiar Foto</v-btn>
          <input type="file" ref="fileInput" @change="onFileChange" style="display: none" accept="image/*" />
        </v-card-text>
        <div style="text-wrap: wrap;">
          <h3 class="mb-1">{{ usuario.nombre }}</h3>
          <p class="text-muted">@{{ usuario.usuario }}</p>
        </div>
      </v-card-title>

      <v-card-text>
        <v-list class="data-table">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-email</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title><a class="data-table" href="mailto:{{ usuario.correo }}">{{ usuario.correo
                  }}</a></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-phone</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title><a class="data-table" href="tel:+{{ usuario.telefono }}">{{ usuario.telefono
                  }}</a></v-list-item-title>
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
import * as controller from '../Controller'
const darkTheme = ref(window.matchMedia('(prefers-color-scheme: dark)').matches);
const usuario = ref({
  nombre: usuarioActual.nombre.replace(/"/g, '') || 'Nombre no disponible',
  usuario: usuarioActual.usuario.replace(/"/g, '') || 'Usuario no disponible',
  correo: usuarioActual.correo.replace(/"/g, '') || 'Correo no disponible',
  telefono: usuarioActual.telefono.replace(/"/g, '') || 'Teléfono no disponible',
  foto: usuarioActual.foto.replace(/"/g, '') || 'https://via.placeholder.com/150'
});

const selectImage = () => {
  document.querySelector('input[type="file"]').click();
};

const onFileChange = (event) => {
  const file = event.target.files[0];

  if (file) {
    const formData = new FormData();
    formData.append('foto', file);  
    formData.append('id_usuario', usuarioActual.id_usuario); 


    convertToBase64(file).then((base64Image) => {

      usuario.value.foto = base64Image;
      localStorage.setItem("admin_foto", base64Image);


      savePhotoToDatabase(formData);
    }).catch(error => {
      console.error('Error converting image to Base64:', error);
    });
  }
};
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]); 
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const savePhotoToDatabase = async (formData) => {
  try {
    console.log('Sending formData:', formData);
    

    await controller.actualizarFotoUsuario(formData);
    window.location.reload();
    console.log('Foto actualizada con éxito');
  } catch (error) {
    console.error('Error al actualizar foto:', error);
  }
};

console.log(usuario); 


</script>
<style src="../assets/main.css" scoped></style>
<template>
  <v-progress-circular class="loading-circle" v-if="!isLoaded" color="primary" indeterminate></v-progress-circular>
  <v-container v-if="isLoaded" class="container">
    <v-card class="user-form data-table">
      <v-card-title class="data-table-title">
        Administración de usuarios
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field v-model="username" label="Nombre de usuario" placeholder="Nombre de usuario"
            :rules="[rules.required]" required></v-text-field>
          <v-text-field v-model="name" label="Nombre completo" placeholder="Nombre completo" :rules="[rules.required]"
            required></v-text-field>
          <v-text-field v-model="email" label="Email" placeholder="Email del usuario"
            :rules="[rules.required, rules.email]" required></v-text-field>
          <v-text-field v-model="password" label="Contraseña" placeholder="Contraseña del usuario"
            :rules="[rules.required, rules.password]" type="password" required></v-text-field>
          <v-select v-model="role" :items="roles" label="Rol" placeholder="Selecciona un rol" :rules="[rules.required]"
            required></v-select>

          <v-btn v-if="!isEditing" @click="submit('insert')" :disabled="!valid" color="success">
            Agregar Usuario
          </v-btn>
          <v-btn v-if="isEditing" @click="submit('update')" :disabled="!valid" color="blue">
            Actualizar Usuario
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card class="user-list data-table">
      <v-card-title class="data-table-title">
        Lista de Usuarios
      </v-card-title>
      <v-data-table :headers="headers" :items="users" class="data-table" item-value="id">
        <template v-slot:item.estado="{ item }">
          <v-checkbox style="display: block;width: 106px;" v-model="item.estado" :label="item.estado === 1 ? 'Activo' : 'Inactivo'" :value="1"
            :false-value="0" @change="() => actualizarEstadoUsuario(item.id_usuario, item.estado)"></v-checkbox>
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="act-btn-container" style="display: block; max-width: 100%;">
            <v-btn class="act-btn" @click="editUser(item)" color="primary">
              Editar
            </v-btn>
            <v-btn class="act-btn" @click="deleteUser(item)" color="error">
              Eliminar
            </v-btn>
          </div>

        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import * as controller from '../Controller';
const isLoaded = ref(false);
const data = ref();
const users = ref([]);
onMounted(async () => {
  isLoaded.value = false;
  try {
    data.value = await controller.obtenerUsuarios();
    if (data.value && Array.isArray(data.value)) {
      users.value = data.value;
    }
  } catch (error) {
    isLoaded.value = false;
    console.error("Error fetching users:", error);
  } finally {
    isLoaded.value = true;
  }
});


console.log("info del Usuarios: ", data);

const valid = ref(false);
const usuarioid = ref('');
const username = ref('');
const name = ref('');
const email = ref('');
const password = ref('');
const isEditing = ref(false);
const role = ref('');
const roles = ['Administradores', 'Ciudadano', 'Recolectores', 'Composteros', 'Jardineros', 'Empleados'
];



console.log("users array ", users.value);

const headers = [
  { title: 'ID', value: 'id_usuario', sortable: true },
  { title: 'Nombre Usuario', value: 'n_usuario', sortable: true },
  { title: 'Nombre Completo', value: 'n_completo', sortable: true },
  { title: 'Correo Electrónico', value: 'n_correo' },
  { title: 'Rol', value: 'tipo', sortable: true },
  { title: 'Estado', value: 'estado', sortable: true },
  { title: 'Acciones', value: 'actions', sortable: false },
];

const rules = {
  required: value => !!value || 'Este campo es requerido',
  email: value => /.+@.+\..+/.test(value) || 'Email inválido',
  password: value => value && value.length >= 6 || 'La contraseña debe tener al menos 6 caracteres',
};

const submit = async (operation) => { //enviar datos a bd
  if (valid.value) {
    const newUser = {
      id_usuario: usuarioid.value,
      username: username.value,
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    };

    if (operation == "insert") {
      try {
        await controller.insertarUsuario(newUser);

        users.value.push({
          id: newUser.id_usuario + 1,
          n_usuario: newUser.username,
          n_completo: newUser.name,
          n_correo: newUser.email,
          tipo: newUser.role,
        });

        // vaciar formulario
        resetForm();
      } catch (error) {
        console.error('Error inserting user:', error);
      }
    }
    if (operation == "update") {
      console.log("actualizar!");
      try {
        await controller.actualizarUsuario(newUser);

        users.value.push({
          id: newUser.id_usuario + 1,
          n_usuario: newUser.username,
          n_completo: newUser.name,
          n_correo: newUser.email,
          tipo: newUser.role,
        });

        // vaciar formulario
        resetForm();
      } catch (error) {
        console.error('Error inserting user:', error);
      }
    }

  }
};

function resetForm() {
  isEditing.value = false;
  username.value = '';
  name.value = '';
  email.value = '';
  password.value = '';
  role.value = '';
}

const editUser = user => {
  isEditing.value = true;
  usuarioid.value = user.id_usuario;
  username.value = user.n_usuario;
  name.value = user.n_completo;
  email.value = user.n_correo;
  role.value = user.tipo;
};

const deleteUser = user => {
  users.value = users.value.filter(u => u.id !== user.id);
};

const actualizarEstadoUsuario = async (id_usuario, estado) => {
    try {
        const formData = [{
            id_usuario: id_usuario,
            estado: estado
        }];
        console.log("formdataEstado", formData);

        await controller.actualizarEstadoUsuario(formData);
        console.log(`Estado de usuario actualizado a: ${estado === 1 ? 'Activo' : 'Inactivo'}`);
    } catch (error) {
        console.error('Error al actualizar estado:', error);
    }
};
</script>

<style src="../assets/main.css" scoped></style>

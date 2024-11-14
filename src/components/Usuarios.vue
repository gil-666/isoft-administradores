<template>
  <v-progress-circular class="loading-circle" v-if="!isLoaded" color="primary" indeterminate></v-progress-circular>
  <v-container v-if="isLoaded" class="container">
    <v-row>
      <v-col cols="12">

        <v-card class="user-form">
          <v-card-title>
            Administración de usuarios
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid" ref="form">
              <v-text-field v-model="username" label="usuario" placeholder="Nombre de usuario" :rules="[rules.required]"
                required></v-text-field>
              <v-text-field v-model="name" label="Nombre completo" placeholder="Nombre completo"
                :rules="[rules.required]" required></v-text-field>
              <v-text-field v-model="email" label="Email" placeholder="Email del usuario"
                :rules="[rules.required, rules.email]" required></v-text-field>
              <v-text-field v-model="password" label="Contraseña" placeholder="Contraseña del usuario"
                :rules="[rules.required, rules.password]" type="password" required></v-text-field>
              <v-select v-model="role" :items="roles" label="Rol" placeholder="Selecciona un rol"
                :rules="[rules.required]" required></v-select>

              <v-btn v-if="!isEditing" @click="submit('insert')" :disabled="!valid" color="success">
                Agregar Usuario
              </v-btn>
              <v-btn v-if="isEditing" @click="submit('update')" :disabled="!valid" color="blue">
                Actualizar Usuario
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
        <v-card class="user-list">
          <v-card-title>
            <h2>Lista de Usuarios</h2>
          </v-card-title>
          <v-data-table :headers="headers" :items="users" class="user-list-table" item-value="id">
            <template v-slot:item.actions="{ item }">
              <div class="act-btn-container">
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
      </v-col>
    </v-row>
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
const usuarioid =ref('');
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
  { title: 'ID', value: 'id_usuario' },
  { title: 'Nombre Usuario', value: 'n_usuario' },
  { title: 'Nombre Completo', value: 'n_completo' },
  { title: 'Correo Electrónico', value: 'n_correo' },
  { title: 'Rol', value: 'tipo' },
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
        username.value = '';
        name.value = '';
        email.value = '';
        password.value = '';
        role.value = '';
      } catch (error) {
        console.error('Error inserting user:', error);
      }
    }
    if (operation == "update"){
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
        username.value = '';
        name.value = '';
        email.value = '';
        password.value = '';
        role.value = '';
      } catch (error) {
        console.error('Error inserting user:', error);
      }
      isEditing.value = false;
    }

  }
};

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
</script>

<style scoped>
.user-list-table {
  text-align: start;
}

.container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  max-width: 900px;
  margin: 0 auto;
}

h1,
h2 {
  color: #333;
}

.user-form {
  margin-bottom: 20px;
}

.user-list {
  margin-top: 20px;
}
</style>

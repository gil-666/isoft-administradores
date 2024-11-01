<template>
  <v-container class="container">
    <v-row>
      <v-col cols="12">

        <v-card class="user-form">
          <v-card-title>
            Administración de usuarios
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid" ref="form">
              <v-text-field
                v-model="name"
                label="Nombre"
                placeholder="Nombre del usuario"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="email"
                label="Email"
                placeholder="Email del usuario"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Contraseña"
                placeholder="Contraseña del usuario"
                :rules="[rules.required, rules.password]"
                type="password"
                required
              ></v-text-field>
              <v-select
                v-model="role"
                :items="roles"
                label="Rol"
                placeholder="Selecciona un rol"
                :rules="[rules.required]"
                required
              ></v-select>

              <v-btn @click="submit" :disabled="!valid" color="success">
                Agregar Usuario
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
        <v-card class="user-list">
          <v-card-title>
            <h2>Lista de Usuarios</h2>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="users"
            class="elevation-1"
            item-value="id"
          >
            <template v-slot:item.actions="{ item }">
              <v-btn @click="editUser(item)" color="primary" class="mr-2">
                Editar
              </v-btn>
              <v-btn @click="deleteUser(item)" color="error">
                Eliminar
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const valid = ref(false);
const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('');
const roles = ['Administrador', 'Ciudadano', 'Productor', 'Chofer', 'Empleado'
];
const users = ref([
  { id: 1, name: 'Juan Perez', email: 'juan@example.com', role: 'Administrador' },
  { id: 2, name: 'Maria Garcia', email: 'maria@example.com', role: 'Ciudadano' },
]);

const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Nombre', value: 'name' },
  { text: 'Email', value: 'email' },
  { text: 'Rol', value: 'role' },
  { text: 'Acciones', value: 'actions', sortable: false },
];

const rules = {
  required: value => !!value || 'Este campo es requerido',
  email: value => /.+@.+\..+/.test(value) || 'Email inválido',
  password: value => value && value.length >= 6 || 'La contraseña debe tener al menos 6 caracteres',
};

const submit = () => {
  if (valid.value) {
    users.value.push({
      id: users.value.length + 1,
      name: name.value,
      email: email.value,
      role: role.value,
    });

    name.value = '';
    email.value = '';
    password.value = '';
    role.value = '';
  }
};

const editUser = user => {
  name.value = user.name;
  email.value = user.email;
  role.value = user.role;
};

const deleteUser = user => {
  users.value = users.value.filter(u => u.id !== user.id);
};
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  max-width: 900px;
  margin: 0 auto;
}

h1, h2 {
  color: #333;
}

.user-form {
  margin-bottom: 20px;
}

.user-list {
  margin-top: 20px;
}
</style>

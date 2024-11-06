<template>
    <v-container class="d-flex justify-center align-center" fluid>
      <v-form v-model="valid" lazy-validation>
        <v-card class="pa-4" elevation="2" max-width="400">
          <v-card-title>
            <span class="text-h5">Iniciar Sesión</span>
          </v-card-title>
  
          <v-card-text>
            <v-text-field
              v-model="email"
              label="Correo Electrónico"
              :rules="[rules.required, rules.email]"
              type="email"
              required
            ></v-text-field>
  
            <v-text-field
              v-model="password"
              label="Contraseña"
              :rules="[rules.required]"
              type="password"
              required
            ></v-text-field>
  
            <v-btn text @click="forgotPassword" class="mt-2">Olvidaste la contraseña?</v-btn>
          </v-card-text>
  
          <v-card-actions>
            <v-btn color="primary" @click="submitForm" :disabled="!valid">Enviar</v-btn>
            <v-spacer></v-spacer>
            <v-btn text @click="register">Regístrate</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
        valid: false,
        rules: {
          required: (value) => !!value || 'Requerido.',
          email: (value) => {
            const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
            return pattern.test(value) || 'Correo electrónico no válido.';
          },
        },
      };
    },
    methods: {
      submitForm() {
        if (this.valid) {
          window.location.href = "/menu";
        }
      },
      forgotPassword() {
        alert('olvido contra');
      },
      register() {
        alert('registro');
      },
    },
  };
  </script>
  
  <style scoped>
  .v-container {
    margin-top: 20px;
  }
  </style>
  
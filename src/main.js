import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from "vue3-apexcharts";
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import { VTimePicker } from 'vuetify/lib/labs/components.mjs';
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
    },
      VTimePicker
  });

  export const usuarioActual = {
    nombre: localStorage.getItem("n_completo"),
    usuario: localStorage.getItem("n_usuario"),
    correo: localStorage.getItem("n_correo"),
    telefono: localStorage.getItem("admin_tel"),
    foto: localStorage.getItem("admin_foto")
  };

const app = createApp(App).component('apexchart', VueApexCharts).use(router).use(vuetify).use(VueApexCharts).mount('#app');


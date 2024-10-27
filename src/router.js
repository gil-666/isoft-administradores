import { createRouter, createWebHistory } from 'vue-router';
import Inicio from './components/Inicio.vue';
import Usuarios from './components/Usuarios.vue';
import Login from './components/Login.vue';
import Solicitudes from './components/Solicitudes.vue';
import Sanciones from './components/Sanciones.vue';
//las rutas del sitio se definen en un enrutador, que dicen cual componente se muestra en esa ruta
const routes = [
    { path: '/', component: Inicio, name: 'Inicio'},
    { path: '/usuarios', component: Usuarios, name: 'Usuarios'},
    { path: '/login', component: Login, name: 'Login'},
    { path: '/solicitudes', component: Solicitudes, name: 'Solicitudes'},
    { path: '/sanciones', component: Sanciones, name: 'Sanciones'}

  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export default router;
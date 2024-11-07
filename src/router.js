import { createRouter, createWebHistory } from 'vue-router';
import Inicio from './components/Inicio.vue';
import Login from './components/Login.vue';
import Menu from './components/Menu.vue';
import Sanciones from './components/Sanciones.vue';
import Solicitudes from './components/Solicitudes.vue';
import Usuarios from './components/Usuarios.vue';
//las rutas del sitio se definen en un enrutador, que dicen cual componente se muestra en esa ruta
const routes = [
    { path: '/', component: Inicio, name: 'Inicio'},
    { path: '/usuarios', component: Usuarios, name: 'Usuarios', meta: { requiresAuth: true }},
    { path: '/login', component: Login, name: 'Login'},
    { path: '/solicitudes', component: Solicitudes, name: 'Solicitudes', meta: { requiresAuth: true }},
    { path: '/sanciones', component: Sanciones, name: 'Sanciones', meta: { requiresAuth: true }},
    { path: '/menu', component: Menu, name: 'Menu', meta: { requiresAuth: true }}

  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  router.beforeEach((to, from, next) => {
    const authToken = localStorage.getItem('auth_token');
  
    //checar si la ruta ocupa autenticacion
    if (to.meta.requiresAuth && !authToken) {
      //regresar al login si no hay inicio de sesion
      next('/');
    } else {
      // Allow the navigation if authenticated or no authentication required
      next();
    }
  });
  
  export default router;
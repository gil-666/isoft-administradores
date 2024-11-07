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
    { path: '/usuarios', component: Usuarios, name: 'Usuarios'},
    { path: '/login', component: Login, name: 'Login'},
    { path: '/solicitudes', component: Solicitudes, name: 'Solicitudes'},
    { path: '/sanciones', component: Sanciones, name: 'Sanciones'},
    { path: '/menu', component: Menu, name: 'Menu'}

  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  router.beforeEach((to, from, next) => {
    const authToken = localStorage.getItem('auth_token');
  
    // Check if the route requires authentication
    if (to.meta.requiresAuth && !authToken) {
      // Redirect to login if not authenticated
      next('/');
    } else {
      // Allow the navigation if authenticated or no authentication required
      next();
    }
  });
  
  export default router;
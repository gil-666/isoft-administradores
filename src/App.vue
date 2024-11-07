
<template>
    <header class="header">
    <nav class="nav-container">
      <div class="logo-container">
        <img src="/src/assets/admin.png" alt="Logo" class="logo-icon" />
        <h1 class="logo-text">Administracion</h1>
      </div>
      <ul class="nav-links">
        <li>
          <a href="/solicitudes">
            <img src="/src/assets/solicitud-de-amistad.png" alt="Solicitudes" class="nav-icon" />
            Solicitudes
          </a>
        </li>
        <li>
          <a href="/sanciones">
            <img src="/src/assets/juicio.png" alt="Sanciones" class="nav-icon" />
            Sanciones
          </a>
        </li>
        <li>
          <a href="/" class="highlight-red">
            <img src="/src/assets/fertilizante.png" alt="Producción" class="nav-icon" />
            Producción
          </a>
        </li>
        <li>
          <a href="/" class="highlight-red">
            <img src="/src/assets/rec.png" alt="Recompensas" class="nav-icon" />
            Recompensas
          </a>
        </li>
        <li>
          <a href="/usuarios">
            <img src="/src/assets/usuario.png" alt="Usuarios" class="nav-icon" />
            Usuarios
          </a>
        </li>
      </ul>
    </nav>
  </header>
  <!-- header -->
  <!--
  <header>
    <div class="logo-div">
      <a class="logo" href="/">
        <h1 style="font-weight: 500;">Administradores</h1>
        <img class="logo" style="color: blue;" width="20px" height="20px" src="./assets/recycle.png">
      </a>
    </div>
    <div class="header-buttons">
      
    </div>
    <v-divider vertical></v-divider>
    <div class="login-setting">
      <p>Hola, usuario</p>
      <a class="button" href="/login">Iniciar sesión</a>
      
    </div>

  </header>
-->
  <!-- aqui empieza el contenido -->
  <main>
    <!-- el router es el que cambia el componente que esta en vista -->
     <suspense> <!-- suspense es un componente que hace que la app primero espere a terminen de correr las funciones asincronas antes de render la interfaz -->
      <router-view/>
     </suspense>
    
  </main>
</template>

<style scoped>
/* .container {
  background-color: rgba(0, 0, 0, 0.281);
  padding: 20px;
  border-radius: 20px;
} */
.login-setting {
  margin-left: 5px;
  line-height: 1.5;
  display: block;
  place-items: center;
}

.header-buttons {
  /* margin: 20px; */
  padding: 10px;
}

header {
  line-height: 1.2;
  display: block;
  align-items: center;
  text-align: center;
  margin: 0 auto 1rem;
  transition: 400ms;
}

.logo-div{
  display: inline-flex;
  place-items: center;

}
.logo {
  background-color: unset;
  margin: 0 auto;
  box-shadow: none;
  display: flex;
  place-items: center;
}

.logo:hover {
  color: hsla(212, 100%, 50%, 0.616);
}

/* estilos cuando la ventana está extendida */
@media (min-width: 1024px) {
  header {
    display: inline-flex;
    text-align: center;
    line-height: 1.5;
    place-items: center;
    /* padding-right: calc(var(--section-gap) / 2); */
  }

  .logo {
    margin: 0 2rem 0 0.3rem;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>

<script setup></script>

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

  <div class="cards-list">
    <!-- Tarjetas (sin cambios) -->
    <a href="/solicitudes" class="card">
      <div class="card_image">
        <img src="/src/assets/analysis.png" alt="Card Image" />
      </div>
      <div class="card_title title-white">
        <p>Card Title</p>
      </div>
    </a>
  </div>
</template>

<style scoped>
/* Estilos del header y navegación */
.header {
  background-color: #2c3e50;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #ecf0f1;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #ecf0f1;
}

.nav-links {
  display: flex;
  list-style: none;
}

.nav-links li {
  margin-left: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #ecf0f1;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.nav-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.highlight-red {
  color: #e74c3c;
}
</style>

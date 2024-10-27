<template>
  <div class="container">
    <h1>Menú Principal</h1>

    <!-- Sección de botones del menú principal -->
    <div class="menu-buttons">
      <button class="btn">Administrar Usuarios</button>
      <button class="btn">Administrar Productos</button>
      <button class="btn">Ver Solicitudes</button>
      <button class="btn">Reportes</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  background-color: #f4f4f9;
  border-radius: 10px;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

button.btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.btn:hover {
  background-color: #0056b3;
}
</style>

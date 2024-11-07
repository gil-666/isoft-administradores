<template>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;600&display=swap" rel="stylesheet">

    <div class="container">
        <div class="form-container">
            <h3>Sign Up</h3>
          

            <form class="sign-up-form">
                <label for="text" >Usuario</label>
                <input type="text" placeholder="Ingrese su nombre de usuario" id="u">

                <label for="password">Contraseña</label>
                <input type="password" placeholder="Elija una contraseña" id="password">

                <button>Registrarse</button>
                <p>¿Ya tienes una cuenta? <a href="#">Inicia sesión aquí</a> o inicia sesión con <a href="#">Google</a>.</p>
            </form>
        </div>
        <div class="illustration">
            <img src="/src/assets/admin.png" alt="admin">
        </div>
    </div>
</template>

<style media="screen">
*,
*:before,
*:after {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f2f6ff;
}

.container {
    display: flex;
    width: 80%;
    max-width: 900px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;
}

.form-container {
    width: 50%;
    padding: 40px;
}

.form-container h3 {
    font-size: 28px;
    text-align: center;
   
    color: #4c94e4 ;
    margin-bottom: 10px;
}

.form-container p {
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
}

.sign-up-form label {
    display: block;
    font-size: 14px;
    color: #333;
    margin-top: 20px;
}

input {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
}

button {
    margin-top: 20px;
    width: 100%;
    padding: 12px;
    background-color: #ff4757;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #e63946;
}

.illustration {
    width: 50%;
    background-color: #f2f6ff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

/* Ajustes de enlace */
p a {
    color: #ff4757;
    text-decoration: none;
}

p a:hover {
    text-decoration: underline;
}
</style>

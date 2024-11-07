<script setup>
    import { ref } from 'vue';
import '../Controller'
import { autenticarUser } from '../Controller';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
const router = useRouter();

const username = ref('');
const password = ref('');
onMounted(() => {
  const authToken = localStorage.getItem('auth_token');

  if (authToken) {
    router.push('/menu');  // Redirect to menu if token exists
  } else {
    router.push('/');  // Redirect to login if no token
  }
});
let authIntentos = ref(0);
    async function validateLogin() { //autenticar el usuario
        const formData = {
            username: username.value,
            password: password.value
        }
        const resultado = await autenticarUser(formData);
        if(resultado){
            // window.location.href = '/menu';
            router.push('/menu');
        }else{
            authIntentos.value++
        }
    }
</script>
<template>


    <div class="login-container">
        <div class="form-container">
            <div class="icon-container">
                <img src="/src/assets/admin.png" alt="admin icon">
            </div>
            <h3>Iniciar Sesión</h3>
            <div class="login-error" v-if="authIntentos > 0"> <!-- solo aparece cuando ya se intento iniciar sesion incorrectamente -->
                <span>Usuario o contraseña incorrecta!</span>
            </div>
            <form class="sign-up-form" @submit.prevent="validateLogin()">
                <label for="text">Usuario</label>
                <input class="input-l" type="text" v-model="username" placeholder="Ingrese su usuario" id="usuario">

                <label for="password">Contraseña</label>
                <input class="input-l"type="password" v-model="password" placeholder="Ingrese su contraseña" id="password">

                <button class="button-l">Iniciar Sesión</button>
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
    display: block;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #e9f2ff;
}

.login-container {
    display: flex;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    border-radius: 12px;
    overflow: hidden;
    background-color: #fff;
    transition: transform 0.3s ease;
}

.login-container:hover {
    transform: scale(1.02);
}

.form-container {
    width: 50%;
    padding: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
}

.icon-container {
    display: none;
}

.form-container h3 {
    font-size: 28px;
    text-align: center;
    color: #306bbf;
    margin-bottom: 20px;
}

.sign-up-form label {
    display: block;
    font-size: 14px;
    color: #333;
    margin-top: 20px;
}

.input-l {
    width: 100%;
    
    padding: 12px;
    margin-top: 8px;
    border: 1px solid #e0dede;
    border-radius: 8px;
    background-color: #f0f4fa;
    transition: border-color 0.3s ease;
}

input:focus {
    border-color: #7ea7e2;
    outline: none;
}

.button-l {
    margin-top: 30px;
    width: 100%;
    padding: 14px;
    background-color: #306bbf;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 4px 12px rgba(48, 107, 191, 0.3);
}


.button-l:hover {
    background-color: #1f4a83;
}

.illustration {
    width: 50%;
    background-color: #e9f2ff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.illustration img {
    width: 80%;
    max-width: 250px;
}

/* Responsive Styles */
@media (max-width: 768px) {
    .container {
        flex-direction: column;
        max-width: 100%;
        margin: 20px;
        box-shadow: none;
    }
    .icon-container {
        display: block;
        text-align: center;
        margin-bottom: 20px;
    }

    .icon-container img {
        width: 70px; /* Tamaño pequeño para que actúe como ícono */
        height: 70px;
    }

    .form-container {
        width: 100%;
        padding: 20px;
    }

    .illustration {
        display: none;
    }

    .form-container h3 {
        font-size: 24px;
    }

    input, button {
        font-size: 16px;
        padding: 10px;
    }
}

@media (max-width: 480px) {
    .icon-container {
        display: block;
        text-align: center;
        margin-bottom: 20px;
    }

    .icon-container img {
        width: 50px; /* Tamaño pequeño para que actúe como ícono */
        height: 50px;
    }

    .form-container h3 {
        font-size: 22px;
        margin-bottom: 15px;
    }

    .sign-up-form label {
        font-size: 12px;
    }

    input, button {
        font-size: 14px;
        padding: 8px;
    }
}
</style>

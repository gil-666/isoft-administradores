<script setup>
import { fechayHora } from '@/tools';
import * as controller from '../Controller';
import { ref } from 'vue';
const props = defineProps({
    data: {
        type: Object,
        required: true,
        default: () => ({
            n_completo: 'null',
        }),
    },
});
console.log(props.data);
const infoCiudadano = ref(await controller.obtenerCiudadanos({ ciudadanoid: props.data.usuario_id_usuario })); //se debe enviar en objeto json para que el servidor lo pueda leer individualmente
infoCiudadano.value = infoCiudadano.value[0];
console.log("obtenido ciudadano", infoCiudadano.value);
</script>
<template>
    <div class="overlay">
        <v-progress-circular class="loading-circle" v-if="!data" color="white" indeterminate></v-progress-circular>
        <div v-if="data" class="loaded">

            <div class="container-info" @click.stop>

                <v-container style="position: relative;">
                    <div class="exit-button">
                        <v-icon size="2rem" @click="$emit('hideOverlay')">mdi-close</v-icon>
                    </div>
                    <div class="title">
                        <h1>
                            Solicitud #{{ props.data.idsol_usuario }}
                        </h1>
                        <div class="estado-cont">
                                <v-chip
                                :color="props.data.estado === 'Completado' ? 'green' : props.data.estado === 'Pendiente' ? 'yellow' : 'red'"
                                dark
                                style="font-weight: bold; text-align: center; color: white; border-radius: 16px; padding: 0 16px; min-width: auto; height: 30px;">
                                {{ props.data.estado }}
                            </v-chip>
                            </div>
                    </div>

                    <div class="content">
                        <div class="col-1"> <!--columna 1-->
                            <v-divider style="padding-top: 10px;" :thickness="3"></v-divider>
                            <h3>Tipo:</h3><span>{{ props.data.sol_tipo }}</span>
                            <br><br>
                            <h3>Fecha de solicitud:</h3><span>{{ fechayHora(props.data.sol_fechaDeSolicitud) }}</span>
                            <h3>Fecha de finalizacion:</h3><span>{{ fechayHora(props.data.sol_fechaDeFinalizacion) ||
                                'Sin datos' }}</span> <!-- si no hay fecha dice sin datos-->
                            <br><br>
                            <div class="comment">
                                <h3>Comentario:</h3><span>{{ props.data.comentario ||
                                    'Sin comentario' }}</span>
                            </div>
                            
                           

                        </div>
                        <div class="col-2"><!--columna 2-->
                            <h2>Recolector</h2>
                            <p>{{ props.data.nombre_recolector }} (Recolector ID: {{ props.data.Recolector_id_recolector
                                }})</p>
                            <a href="mailto:{{ props.data.recolector_n_correo }}">{{ props.data.recolector_n_correo }}</a>
                            <img :src="props.data.chofer_foto ? 'data:image/jpeg;base64,' + props.data.chofer_foto : '/src/assets/admin.png'"
                                alt="" class="img">
                        </div>

                        <div v-if="infoCiudadano" class="user-detail">
                            <v-divider :thickness="3"></v-divider>
                            <h1 style="margin: 10px auto;">Informacion del usuario:</h1>
                            <v-divider :thickness="3"></v-divider>
                            <h2>Direccion:</h2>
                            <br>
                            <h3>Calle:</h3>
                            <p>{{ infoCiudadano.Reg_direccion }}, {{ infoCiudadano.Reg_colonia }}</p>
                            <h3>Ciudad:</h3>
                            <p>{{ infoCiudadano.Reg_ciudad }}</p>
                            <h3>Estado:</h3>
                            <p>{{ infoCiudadano.Reg_estado }}</p>
                            <h3>Codigo Postal:</h3>
                            <p>{{ infoCiudadano.Reg_codigoPostal }}</p>
                        </div>
                        <div v-if="infoCiudadano" class="user-photo">
                            <br>
                            <h2>Ciudadano: </h2>
                            <p style="font-weight:normal;">{{ props.data.n_completo }} (Usuario ID: {{
                                props.data.usuario_id_usuario }})</p>
                                <a href="mailto:{{ props.data.usuario_n_correo }}">{{ props.data.usuario_n_correo }}</a>
                            <img :src="infoCiudadano.Reg_foto ? 'data:image/jpeg;base64,' + infoCiudadano.Reg_foto : '/src/assets/admin.png'"
                                alt="" class="img">
                        </div>
                    </div>


                </v-container>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.overlay {
    z-index: 4;
    position: fixed;
    overflow: auto;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: translateX(2);
    background-color: rgba(0, 0, 0, 0.8);
    transition: 1s ease-in;
}

.exit-button {
    position: absolute;
    /* Allow the button to be positioned inside the container */
    top: 0;
    /* Position the button at the top */
    right: 0;
    /* Position the button at the left */
    margin: 0;
    /* Remove any default margins */
}

.title {
    line-height: 1.3;
    display: flex;
}

.content {
    display: grid;
    grid-template-areas: "info img";
    gap: 20px;
    grid-template-columns: 4fr 1fr;
}

.container-info {
    opacity: 100%;
    background-color: white;
    width: 50%;
    padding: 30px;
    text-align: start;
    margin: 10px auto;
    border-radius: 10px;
}

.comment {
    background-color: rgb(234, 250, 252);
    padding: 10px;
    border-radius: 10px;
    transition: 0.2s ease-in;
    margin: 0 auto;
}

.comment:hover {
    background-color: rgb(202, 248, 255);
}

.col-1 {
    grid-area: info;
}

.col-2 {
    max-width: fit-content;
    grid-area: img;
    display: block;
    text-align: center;
}

.user-photo {
    text-align: center;
}

.estado-cont{
    /* padding-top: 2px; */
    padding-left: 10px;
    margin: 4px;
}

.img {
    box-shadow: inset 0px 0px 1px 2px rgba(0, 0, 0, 0.5);
    padding: 2px;
    width: 100%;
    height: fit-content;

    border-radius: 8px;
}

.user-detail {
    display: block;
}

@media(max-width:950px) {
    .container-info {
        width: 90%;
        padding: 10px;
        font-size: 11pt;

    }

}

@media(max-width:780px) {
    .container-info {
        width: 90%;
        padding: 10px;
        font-size: 9pt;

    }

}

.loading-circle {
    text-align: center;
    display: block;
    margin: 25% auto;
    transform: scale(2.5);
}
</style>
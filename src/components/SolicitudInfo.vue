<script setup>
import { fechayHora, printPage } from '@/tools';
import * as controller from '../Controller';
import { ref, onMounted } from 'vue';

const props = defineProps({
    data: {
        type: Object,
        required: true,
        default: () => ({
            n_completo: 'null',
        }),
    },
});
const infoCiudadano = ref();
const infoRecompensa = ref();
const isLoaded = ref(false); //si ya termino de cargar lo que necesita
console.log(props.data);

onMounted(async () => {
    isLoaded.value = false;
    if (props.data == null) {
        return;
    }
    try {
        if (props.data != null) {
            infoCiudadano.value = await controller.obtenerCiudadanos({ ciudadanoid: props.data.usuario_id_usuario }); //se debe enviar json para que el servidor lo pueda leer individualmente
            infoCiudadano.value = infoCiudadano.value[0]; //convertir el arreglo en un solo object
            infoRecompensa.value = await controller.obtenerRecompensaUsuario({ solicitudid: props.data.idsol_usuario });
            console.log(infoRecompensa.value);
        } else {

            return;
        }
    } catch (err) {
        isLoaded.value = false;
        console.error(err);
    } finally {
        isLoaded.value = true;
        console.log("obtenido ciudadano", infoCiudadano.value);//debug
    }
});

</script>

<template>
    <div class="overlay">
        <v-progress-circular class="loading-circle no-print" v-if="!isLoaded" color="white"
            indeterminate></v-progress-circular>
        <div v-if="isLoaded" class="loaded">

            <div class="container-info " @click.stop>

                <v-container class="container-content " style="position: relative;">
                    <div class="options-bar no-print">
                        <v-icon size="2rem" @click="printPage">mdi-printer</v-icon>
                        <v-icon size="2rem" @click="$emit('hideOverlay')">mdi-close</v-icon>
                    </div>
                    <div class="title">
                        <h1 class="title-solicitud">
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
                        <div class="col-1 "> <!--columna 1-->
                            <v-divider style="padding-top: 10px;" :thickness="3"></v-divider>
                            <h3>Tipo:</h3><span>{{ props.data.sol_tipo }}</span>
                            <br><br>
                            <h3>Fecha de solicitud:</h3><span>{{ fechayHora(props.data.sol_fechaDeSolicitud) }}</span>
                            <h3>Fecha de finalizacion:</h3><span>{{ props.data.sol_fechaDeFinalizacion ?
                                fechayHora(props.data.sol_fechaDeFinalizacion) : "N/A" }}</span>
                            <!-- si no hay fecha dice sin datos-->
                            <br><br>
                            <div class="comment">
                                <h3>Comentario:</h3><span>{{ props.data.comentario ||
                                    'Sin comentario' }}</span>
                            </div>
                        </div>
                        <div class="col-2"><!--columna 2-->
                            <br>
                            <div class="recolector-info">
                                <h2>Recolector</h2>
                                <p>{{ props.data.nombre_recolector }} (Recolector ID: {{
                                    props.data.Recolector_id_recolector
                                }})</p>
                                <a href="mailto:{{ props.data.recolector_n_correo }}">{{ props.data.recolector_n_correo
                                    }}</a>
                            </div>

                            <img :src="props.data.chofer_foto ? 'data:image/jpeg;base64,' + props.data.chofer_foto : '/src/assets/admin.png'"
                                alt="" class="img">
                        </div>
                        <div class="user-detail-title">
                            <v-divider :thickness="3"></v-divider>
                            <h1 style="margin: 10px auto;">Informacion del usuario:</h1>
                            <v-divider :thickness="3"></v-divider>
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
                        <div v-if="infoCiudadano" class="user-detail">
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
                        <!-- recompensa-->
                        <div v-if="infoRecompensa.length > 0" class="recompensa-container page-break">
                            <div class="recompensa" v-for="(recompensa, index) in infoRecompensa" :key="index">
                                <div class="recompensa-detail-title">
                                    <v-divider :thickness="3"></v-divider>
                                    <h1 style="margin: 10px auto;">Recompensa:</h1>
                                    <v-divider :thickness="3"></v-divider>
                                </div>
                                <div class="recompensa-photo">
                                    <h2>Planta: </h2>
                                    <p>{{ recompensa.nombrePlanta }} <br> (Planta ID: {{ recompensa.idPlantas }})</p>
                                    <img :src="recompensa.imagen ? 'data:image/jpeg;base64,' + recompensa.imagen : '/src/assets/admin.png'"
                                        alt="" class="img">
                                </div>
                                <br>
                                <div class="recompensa-detail">
                                    <h2>Detalles de recompensa:</h2>
                                    <br>
                                    <h3>Descripcion:</h3>
                                    <p>{{ recompensa.descripcionplanta }}</p>
                                    <h3>Puntos requeridos:</h3>
                                    <p>{{ recompensa.puntosRequeridos }}</p>
                                    <br>
                                    <div class="comment">
                                        <h3>Comentario al recolector:</h3>
                                        <span>{{ recompensa.sol_comentarioAlRecolector || 'Sin comentario' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>


                </v-container>
            </div>
        </div>
    </div>
</template>

<style scoped>
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

.options-bar {
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
    /* line-height: 1.; */
    display: inline-flex;
    color: black;
    place-items: center;
    margin: 3px auto;
}

.title-solicitud {
    width: 80%;
    margin: 3px auto;
}

.content {
    display: grid;
    grid-template-areas: "info img"
        "info2title info2title"
        "info2 img2"
        "recompensa-cont recompensa-cont";
    /* grid-auto-rows: min-content; */
    overflow: hidden;
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
    max-width: 100%;
    /* height: 10px; */
    grid-area: img;
    display: block;
    text-align: center;
}

.user-photo {
    text-align: center;
    grid-area: img2;
}

.recompensa-photo {
    text-align: center;
    grid-area: img3;
}

.user-detail {
    text-align: start;
    grid-area: info2;
}

.recompensa-detail {
    text-align: start;
    grid-area: info3;
}

.user-detail-title {
    grid-area: info2title;
}

.recompensa-detail-title {
    grid-area: info3title;
}

.recompensa {
    display: grid;
    grid-template-areas: "info3title info3title" "info3 img3";
    grid-area: recompensa;
    gap: 20px;
    grid-template-columns: 2fr 1fr;
}

.recompensa-container {
    grid-area: recompensa-cont;

}

.estado-cont {
    /* padding-top: 2px; */
    padding-left: 10px;
    /* margin: 4px; */
    place-items: center;
}

.page-break {
        page-break-before: always;
        page-break-after: always;
        break-before: page;
        break-after: page;
    }

.img {
    box-shadow: inset 0px 0px 1px 2px rgba(0, 0, 0, 0.5);
    padding: 2px;
    width: 150px;
    /* Fixed width */
    height: auto;
    /* Fixed height */
    border-radius: 8px;
    object-fit: fill;
}

.user-detail {
    display: block;
}

@media(max-width:1250px) {
    .container-info {
        width: 90%;
        padding: 10px;
        font-size: 11pt;

    }

}

@media(max-width:500px) {
    .container-info {
        width: 90%;
        padding: 10px;
        font-size: 9pt;
        max-width: fit-content;

    }

    .estado-cont {
        padding-left: 0px;
        text-align: start;
    }

    .title {
        /* text-align:; */
        width: 100%;
        /* margin: 0 auto 0 0 30px; */
        text-align: start;
        padding-right: 100px;
    }

    .title-solicitud {
        /* display: inline-flex; */
        /* color: rgb(255, 255, 255); */
        /* place-items: center; */
        /* margin: 3px auto; */
        /* padding-right: 10px; */
    }

    .container-content {
        text-align: center;
    }

    .content {
        display: inline-block;
        width: 100%;
        /* overflow-y: scroll; */
        grid-template-columns: unset;
        grid-template-areas: unset;
    }

    .recompensa {
        display: inline-block;
        width: 100%;
        /* overflow-y: scroll; */
        grid-template-columns: unset;
        grid-template-areas: unset;
    }

    .img {
        /* max-width: 50%; */
        display: block;
        text-align: center;
        margin: 0 auto;
    }

    .user-detail {
        margin: 10px auto;
        text-align: center;
    }

    .user-detail-title {
        margin: 10px auto;
    }

    .user-photo {
        text-align: center;
        margin: 0 auto;
    }
}

@media (prefers-color-scheme: dark) {
    .container-info {
        background-color: #333;
        color: white;
    }

    .title {
        color: white;
    }

    .content {
        color: white;
    }

    h1 {
        color: white;
    }

    .comment {
        background-color: #4d4d4d;
    }

    .comment:hover {
        background-color: #222222;
    }
}

.loading-circle {
    text-align: center;
    display: block;
    margin: 25% auto;
    transform: scale(2.5);
}



@media print {
    @page {
        margin: 0;
        height: 2000px;
    }

    .container-info {
        font-size: 12pt;
        height: 100px;
    }

    /* Hide elements that should not be printed */
    .no-print {
        display: none;
    }

    .print-header {
        font-size: 18pt;
        font-weight: bold;
        text-align: center;
    }

    
}
</style>
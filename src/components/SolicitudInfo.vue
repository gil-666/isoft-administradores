<script setup>
import { fechayHora } from '@/tools';
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
</script>
<template>
    <div v-if="data" class="overlay">
        <div class="container-info" @click.stop>
            <v-container>
                <div class="title">
                    <h1>
                        Solicitud #{{ props.data.idsol_usuario }}
                    </h1>
                </div>
                <div class="content">
                    <div class="col-1"> <!--columna 1-->
                        <h3>Nombre: </h3><span style="font-weight:normal;">{{ props.data.n_completo }} (ID: {{ props.data.usuario_id_usuario }})</span>
                        <h3>Tipo:</h3><span>{{ props.data.sol_tipo }}</span>
                        <br><br>
                        <h3>Fecha de solicitud:</h3><span>{{ fechayHora(props.data.sol_fechaDeSolicitud) }}</span>
                        <h3>Fecha de finalizacion:</h3><span>{{ fechayHora(props.data.sol_fechaDeFinalizacion) || 'Sin datos' }}</span> <!-- si no hay fecha dice sin datos-->
                    </div>
                    <div class="col-2"><!--columna 2-->
                        <h2>Recolector</h2>
                        <p>{{ props.data.nombre_recolector }} (ID:{{ props.data.Recolector_id_recolector }})</p>
                        <img src="/src/assets/admin.png" alt="" class="img">
                    </div>
                    <div class="user-detail">
                        <h1>Informacion del usuario:</h1>

                    </div>
                </div>


            </v-container>
        </div>
    </div>
</template>

<style lang="css" scoped>

.overlay {
    z-index: 4;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: translateX(2);
    background-color: rgba(0, 0, 0, 0.8);
    transition: 1s ease-in;
}

.content{
    display: grid;
    grid-template-areas: "info img";
    gap: 20px;
    grid-template-columns: 3fr 1fr;
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



.col-1{
    grid-area: info;
}

.col-2 {
    max-width: fit-content;
    grid-area: img;
    display: block;
}


.img {
  box-shadow: inset 0px 0px 1px 2px rgba(0, 0, 0, 0.5);
  width: 100%;
  height: fit-content;
  border-radius: 8px;
}

@media(max-width:780px){
    .container-info{
        width: 90%;
        padding: 10px;
        
    }

}
</style>
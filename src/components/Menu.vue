<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const isLoaded = ref(false);
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async () => {

  const authToken = await localStorage.getItem('auth_token');
  if (authToken) {
    
    isLoaded.value = true;
    router.push('/menu');  // Redirect to menu if token exists
    
  } else {
    router.push('/');  // Redirect to login if no token
  }
});


</script>


<template>
  <v-progress-circular v-if="!isLoaded" color="primary" indeterminate></v-progress-circular>
 <div v-if="isLoaded" class="container menu" style="border-radius: 20px;">
  <h1>Bienvenido</h1>
 </div>
 
</template>

<style scoped>
.menu{
  text-align: center;
}
</style>

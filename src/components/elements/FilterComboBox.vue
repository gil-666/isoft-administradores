<script setup>
import {ref} from 'vue';
defineProps({
  items: Array,
  selection: String,
  label: String,
  placeholder: String
});
defineEmits(['update:selection']);
</script>
<template>
    <v-select :modelValue="selection" :items="items" :label="label" :placeholder="placeholder" @update:modelValue="$emit('update:selection', $event)" ></v-select>
</template>
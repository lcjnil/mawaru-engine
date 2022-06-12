<script lang="ts" setup>
import { MyEngine } from '@/modules';
import { onMounted, ref } from 'vue';

let engine: MyEngine;
const container = ref<HTMLDivElement>();

onMounted(() => {
    console.error(container.value);
    engine = new MyEngine(container.value!);

    engine.start();

    // @ts-expect-error
    window.engine = engine;
});
</script>

<template>
    <div ref="container"></div>
</template>

<style>
canvas {
    background: #f1f1f1;
}
</style>

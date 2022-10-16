<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { PinBallEngine } from '../modules/games/pin-ball';

let engine: PinBallEngine;
const container = ref<HTMLDivElement>();

onMounted(() => {
    engine = new PinBallEngine(container.value!);
    engine.start();
});
</script>

<template>
    <div class="demo">
        <div ref="container"></div>
        <!--        <div class="dialog" v-if="state?.state !== PlayState.playing">-->
        <!--            <button @click="handleStart">开始游戏</button>-->
        <!--        </div>-->
    </div>
</template>

<style scoped>
.demo {
    position: relative;
    display: inline-block;
}

.dialog {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

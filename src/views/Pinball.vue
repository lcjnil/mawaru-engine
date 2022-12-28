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
    </div>
</template>

<style lang="scss" scoped>
.demo {
    position: relative;
    display: inline-block;
    font-size: 0;
}
//
//$size: 92px;
//$position: $size / 2;
//$rPosition: $position * -1;
//
//.demo::after {
//    content: '';
//    position: absolute;
//    top: 0;
//    left: 0;
//    width: 100%;
//    height: 100%;
//    background-image: linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
//    background-size: $size $size;
//    background-position: 0 0, 0 $position, $position $rPosition, $rPosition 0px;
//
//}
</style>

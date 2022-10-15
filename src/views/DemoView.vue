<script lang="ts" setup>
import { ThrowBall } from '../modules/games/pin-ball';
import { onMounted, ref } from 'vue';
import { State, PlayState } from '../modules/games/resource/state';

let engine: ThrowBall;
let state = ref<State>();
const container = ref<HTMLDivElement>();

const handleStart = () => {
    state.value?.start();
};

onMounted(() => {
    engine = new ThrowBall(container.value!);
    engine.start();

    state.value = engine.getResource(State);
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

<script lang="ts" setup>
import { Engine } from '../modules/ecs';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';

const route = useRoute();
const container = ref<HTMLDivElement>();

const rawTests = import.meta.globEager('../modules/games/tests/**.ts');

const TestMap: Record<string, typeof Engine> = Object.fromEntries(
    Object.entries(rawTests).map(([key, value]) => {
        const name = key.split('/').pop()!.split('.').shift();
        return [name, value.default as Engine];
    })
);

const currentTest = ref(
    (route.query.test as string) ?? Object.keys(TestMap)[0]
);

onMounted(() => {
    // @ts-ignore
    const engine = new TestMap[currentTest.value](container.value);
    engine.start();
});
</script>

<template>
    <div class="test-view">
        <h1>这是用于测试的页面</h1>
        <div>当前测试 {{ currentTest }}</div>
        <div class="test-list">
            <div
                class="test-item"
                v-for="test in Object.keys(TestMap)"
                :key="test"
            >
                <router-link :to="{ query: { test } }">{{ test }}</router-link>
            </div>
        </div>
        <div ref="container"></div>
    </div>
</template>

<style lang="stylus" scoped></style>

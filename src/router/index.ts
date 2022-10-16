import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TestView from '@/views/TestView.vue';
import Pinball from '@/views/Pinball.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/pinball',
            name: 'pinball',
            component: Pinball,
        },
        {
            path: '/test',
            name: 'test',
            component: TestView,
        },
    ],
});

export default router;

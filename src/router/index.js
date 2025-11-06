import { createRouter, createWebHistory } from 'vue-router';

const Start        = () => import('../pages/Start.vue');       // new start page
const Adaptive     = () => import('../pages/Adaptive.vue');
const Agency       = () => import('../pages/Agency.vue');
const Architecture = () => import('../pages/Architecture.vue');

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Start', component: Start },            // show Start at /
    { path: '/adaptive', name: 'Adaptive', component: Adaptive },
    { path: '/agency', name: 'Agency', component: Agency },
    { path: '/architecture', name: 'Architecture', component: Architecture },
  ],
  scrollBehavior: () => ({ top: 0 }),
});


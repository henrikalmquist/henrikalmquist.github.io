import { createRouter, createWebHashHistory } from 'vue-router';

const Start        = () => import('../pages/Start.vue');
const Adaptive     = () => import('../pages/Adaptive.vue');
const Agency       = () => import('../pages/Agency.vue');
const Architecture = () => import('../pages/Architecture.vue');

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'Start', component: Start },
    { path: '/adaptive', name: 'Adaptive', component: Adaptive },
    { path: '/agency', name: 'Agency', component: Agency },
    { path: '/architecture', name: 'Architecture', component: Architecture },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

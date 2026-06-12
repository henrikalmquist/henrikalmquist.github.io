import './index.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');

router.afterEach((to) => {
  if (window.goatcounter && window.goatcounter.count) {
    window.goatcounter.count({
      path: to.path,
      title: document.title,
    });
  }
});
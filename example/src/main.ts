import ElementPlus from 'element-plus';
import { createApp } from 'vue';
import './plus';
/* eslint-disable perfectionist/sort-imports */
import App from './App.vue';
/* eslint-enable perfectionist/sort-imports */
import 'element-plus/dist/index.css';
import './style.css';

const app = createApp(App).use(ElementPlus);
app.mount('#app');

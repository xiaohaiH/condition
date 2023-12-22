import { createApp } from 'vue';
import 'virtual:package';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './style.css';
import App from './App.vue';

const app = createApp(App).use(ElementPlus);
app.mount('#app');

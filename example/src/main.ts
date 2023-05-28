import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './style.css';
import App from './v3.vue';

const app = createApp(App).use(ElementPlus);
app.mount('#app');

import { isVue2, createApp } from 'vue-demi';
import './style.css';
import App from './App.vue';

if (isVue2) {
    const app = createApp({
        render: (h: any) => h(App),
    });
    app.mount('#app');
    // @ts-ignore
    window.app = app;
} else {
    const app = createApp(App);
    app.mount('#app');
    // @ts-ignore
    window.app = app;
}

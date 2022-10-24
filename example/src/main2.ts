import Vue from 'vue';
import './style.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './v2.vue';

Vue.use(ElementUI);

const app = new Vue({
    render: (h: any) => h(App),
});
app.$mount('#app');
// @ts-ignore
window.app = app;

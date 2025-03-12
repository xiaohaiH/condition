import ElementUI from 'element-ui';
import Vue from 'vue';
import App from './App.vue';
import 'virtual:package';
import './style.css';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

const app = new Vue({
    render: (h: any) => h(App),
});
app.$mount('#app');
// @ts-expect-error 挂载声明
window.app = app;

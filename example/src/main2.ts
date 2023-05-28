import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import './style.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './v2.vue';

Vue.use(ElementUI); // .use(VueCompositionApi);

console.log(Vue, 111);

const app = new Vue({
    render: (h: any) => h(App),
});
app.$mount('#app');
// @ts-ignore
window.app = app;

var VueDemi = (function (e, s, i) {
    if (e.install) return e; if (!s) return console.error('[vue-demi] no Vue instance found, please be sure to import `vue` before `vue-demi`.'), e; if (s.version.slice(0, 4) === '2.7.') { for (var n in s)e[n] = s[n]; e.isVue2 = !0, e.isVue3 = !1, e.install = function () {}, e.Vue = s, e.Vue2 = s, e.version = s.version, e.warn = s.util.warn, e.hasInjectionContext = () => !!e.getCurrentInstance(), e.createApp = function (n, o) { let r; let t = {}; var u = { config: s.config, use: s.use.bind(s), mixin: s.mixin.bind(s), component: s.component.bind(s), provide(e, i) { return t[e] = i, this; }, directive(e, i) { return i ? (s.directive(e, i), u) : s.directive(e); }, mount(e, i) { return r || ((r = new s(Object.assign({ propsData: o }, n, { provide: Object.assign(t, n.provide) }))).$mount(e, i), r); }, unmount() { r && (r.$destroy(), r = void 0); } }; return u; }; }
    else if (s.version.slice(0, 2) === '2.') {
        if (i) { for (var n in i)e[n] = i[n]; e.isVue2 = !0, e.isVue3 = !1, e.install = function () {}, e.Vue = s, e.Vue2 = s, e.version = s.version, e.hasInjectionContext = () => !!e.getCurrentInstance(); }
        else {
            console.error('[vue-demi] no VueCompositionAPI instance found, please be sure to import `@vue/composition-api` before `vue-demi`.');
        }
    }
    else if (s.version.slice(0, 2) === '3.') { for (var n in s)e[n] = s[n]; e.isVue2 = !1, e.isVue3 = !0, e.install = function () {}, e.Vue = s, e.Vue2 = void 0, e.version = s.version, e.set = function (e, i, n) { return Array.isArray(e) ? (e.length = Math.max(e.length, i), e.splice(i, 1, n), n) : e[i] = n; }, e.del = function (e, i) { Array.isArray(e) ? e.splice(i, 1) : delete e[i]; }; }
    else {
        console.error(`[vue-demi] Vue version ${s.version} is unsupported.`);
    } return e;
}(this.VueDemi = this.VueDemi || (void 0 !== VueDemi ? VueDemi : {}), this.Vue || (typeof Vue != 'undefined' ? Vue : void 0), this.VueCompositionAPI || (typeof VueCompositionAPI != 'undefined' ? VueCompositionAPI : void 0)));

/**
 * Skipped minification because the original files appears to be already minified.
 * Original file: /npm/@vue/composition-api@1.7.2/dist/vue-composition-api.prod.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!(function (n, t) { typeof exports == 'object' && typeof module != 'undefined' ? t(exports) : typeof define == 'function' && define.amd ? define(['exports'], t) : t((n = typeof globalThis != 'undefined' ? globalThis : n || self).VueCompositionAPI = {}); }(this, (n) => {
    'use strict'; let t = function (n, e) { return t = Object.setPrototypeOf || Array.isArray({ __proto__: [] }) && function (n, t) { n.__proto__ = t; } || function (n, t) { for (let e in t)Object.prototype.hasOwnProperty.call(t, e) && (n[e] = t[e]); }, t(n, e); }; let e; let r = function () {
        return r = Object.assign || function (n) {
            for (var t, e = 1, r = arguments.length; e < r; e++) {
                for (let o in t = arguments[e])Object.prototype.hasOwnProperty.call(t, o) && (n[o] = t[o]);
            } return n;
        }, r.apply(this, arguments);
    }; function o(n) { let t = typeof Symbol == 'function' && Symbol.iterator; let e = t && n[t]; let r = 0; if (e) return e.call(n); if (n && typeof n.length == 'number') return { next() { return n && r >= n.length && (n = void 0), { value: n && n[r++], done: !n }; } }; throw new TypeError(t ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'); } function i(n, t) {
        let e = typeof Symbol == 'function' && n[Symbol.iterator]; if (!e) return n; let r; let o; let i = e.call(n); let u = []; try { for (;(void 0 === t || t-- > 0) && !(r = i.next()).done;)u.push(r.value); }
        catch (n) { o = { error: n }; }
        finally {
            try { r && !r.done && (e = i.return) && e.call(i); }
            finally { if (o) throw o.error; }
        } return u;
    } function u(n, t, e) {
        if (e || arguments.length === 2) {
            for (var r, o = 0, i = t.length; o < i; o++)!r && o in t || (r || (r = Array.prototype.slice.call(t, 0, o)), r[o] = t[o]);
        } return n.concat(r || Array.prototype.slice.call(t));
    } let f = []; let a = (function () {
        function n(n) { this.active = !0, this.effects = [], this.cleanups = [], this.vm = n; } return n.prototype.run = function (n) {
            if (this.active) {
                try { return this.on(), n(); }
                finally { this.off(); }
            }
        }, n.prototype.on = function () { this.active && (f.push(this), e = this); }, n.prototype.off = function () { this.active && (f.pop(), e = f[f.length - 1]); }, n.prototype.stop = function () { this.active && (this.vm.$destroy(), this.effects.forEach((n) => { return n.stop(); }), this.cleanups.forEach((n) => { return n(); }), this.active = !1); }, n;
    }()); let c = (function (n) {
        function r(t) {
            void 0 === t && (t = !1); let r; let o = void 0; return (function (n) {
                let t = _; _ = !1; try { n(); }
                finally { _ = t; }
            }(() => { o = z(g()); })), r = n.call(this, o) || this, t || (function (n, t) { let r; if ((t = t || e) && t.active) return void t.effects.push(n); let o = (r = $()) === null || void 0 === r ? void 0 : r.proxy; o && o.$on('hook:destroyed', () => { return n.stop(); }); }(r)), r;
        } return (function (n, e) { if (typeof e != 'function' && e !== null) throw new TypeError(`Class extends value ${String(e)} is not a constructor or null`); function r() { this.constructor = n; }t(n, e), n.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r()); }(r, n)), r;
    }(a)); function l() { return e; } function s() { let n, t; return ((n = l()) === null || void 0 === n ? void 0 : n.vm) || ((t = $()) === null || void 0 === t ? void 0 : t.proxy); } let v = void 0; try { let d = require('vue'); d && b(d) ? v = d : d && 'default' in d && b(d.default) && (v = d.default); }
    catch (n) {} let p = null; let y = null; var _ = !0; let h = '__composition_api_installed__'; function b(n) { return n && V(n) && n.name === 'Vue'; } function g() { return p; } function m() { return p || v; } function w(n) { if (_) { let t = y; t == null || t.scope.off(), (y = n) == null || y.scope.on(); } } function $() { return y; } let j = new WeakMap(); function x(n) { if (j.has(n)) return j.get(n); let t = { proxy: n, update: n.$forceUpdate, type: n.$options, uid: n._uid, emit: n.$emit.bind(n), parent: null, root: null }; !(function (n) { if (!n.scope) { let t = new a(n.proxy); n.scope = t, n.proxy.$on('hook:destroyed', () => { return t.stop(); }); }n.scope; }(t)); return ['data', 'props', 'attrs', 'refs', 'vnode', 'slots'].forEach((e) => { E(t, e, { get() { return n['$'.concat(e)]; } }); }), E(t, 'isMounted', { get() { return n._isMounted; } }), E(t, 'isUnmounted', { get() { return n._isDestroyed; } }), E(t, 'isDeactivated', { get() { return n._inactive; } }), E(t, 'emitted', { get() { return n._events; } }), j.set(n, t), n.$parent && (t.parent = x(n.$parent)), n.$root && (t.root = x(n.$root)), t; } function O(n) { return typeof n == 'function' && /native code/.test(n.toString()); } let S = typeof Symbol != 'undefined' && O(Symbol) && typeof Reflect != 'undefined' && O(Reflect.ownKeys); let k = function (n) { return n; }; function E(n, t, e) { let r = e.get; let o = e.set; Object.defineProperty(n, t, { enumerable: !0, configurable: !0, get: r || k, set: o || k }); } function R(n, t, e, r) { Object.defineProperty(n, t, { value: e, enumerable: !!r, writable: !0, configurable: !0 }); } function C(n, t) { return Object.hasOwnProperty.call(n, t); } function M(n) { return Array.isArray(n); } let P; let D = Object.prototype.toString; let A = function (n) { return D.call(n); }; function U(n) { let t = Number.parseFloat(String(n)); return t >= 0 && Math.floor(t) === t && isFinite(n) && t <= 4294967295; } function B(n) { return n !== null && typeof n == 'object'; } function T(n) { return (function (n) { return Object.prototype.toString.call(n); }(n)) === '[object Object]'; } function V(n) { return typeof n == 'function'; } function W(n, t) { return t = t || $(); } function z(n, t) { void 0 === t && (t = {}); let e = n.config.silent; n.config.silent = !0; let r = new n(t); return n.config.silent = e, r; } function F(n, t) { return function () { for (var e = [], r = 0; r < arguments.length; r++)e[r] = arguments[r]; if (n.$scopedSlots[t]) return n.$scopedSlots[t].apply(n, e); }; } function I(n) { return S ? Symbol.for(n) : n; } let K = I('composition-api.preFlushQueue'); let Q = I('composition-api.postFlushQueue'); let q = 'composition-api.refKey'; let G = new WeakMap(); let H = new WeakMap(); let J = new WeakMap(); function L(n, t, e) { let r = g().util; r.warn; let o = r.defineReactive; let i = n.__ob__; function u() { i && B(e) && !C(e, '__ob__') && sn(e); } if (M(n)) { if (U(t)) return n.length = Math.max(n.length, t), n.splice(t, 1, e), u(), e; if (t === 'length' && e !== n.length) return n.length = e, i == null || i.dep.notify(), e; } return t in n && !(t in Object.prototype) ? (n[t] = e, u(), e) : n._isVue || i && i.vmCount ? e : i ? (o(i.value, t, e), cn(n, t, e), u(), i.dep.notify(), e) : (n[t] = e, e); } let N = !1; function X(n) { N = n; } let Y = function (n) { E(this, 'value', { get: n.get, set: n.set }); }; function Z(n, t, e) { void 0 === t && (t = !1), void 0 === e && (e = !1); let r = new Y(n); e && (r.effect = !0); let o = Object.seal(r); return t && J.set(o, !0), o; } function nn(n) { let t; if (tn(n)) return n; let e = pn(((t = {})[q] = n, t)); return Z({ get() { return e[q]; }, set(n) { return e[q] = n; } }); } function tn(n) { return n instanceof Y; } function en(n) { return tn(n) ? n.value : n; } function rn(n) { if (!T(n)) return n; let t = {}; for (let e in n)t[e] = on(n, e); return t; } function on(n, t) { t in n || L(n, t, void 0); let e = n[t]; return tn(e) ? e : Z({ get() { return n[t]; }, set(e) { return n[t] = e; } }); } function un(n) { let t; return Boolean(n && C(n, '__ob__') && typeof n.__ob__ == 'object' && ((t = n.__ob__) === null || void 0 === t ? void 0 : t.__v_skip)); } function fn(n) { let t; return Boolean(n && C(n, '__ob__') && typeof n.__ob__ == 'object' && !((t = n.__ob__) === null || void 0 === t ? void 0 : t.__v_skip)); } function an(n) { if (!(!T(n) || un(n) || M(n) || tn(n) || (t = n, e = g(), e && t instanceof e) || G.has(n))) { var t, e; G.set(n, !0); for (let r = Object.keys(n), o = 0; o < r.length; o++)cn(n, r[o]); } } function cn(n, t, e) { if (t !== '__ob__' && !un(n[t])) { let r; let o; let i = Object.getOwnPropertyDescriptor(n, t); if (i) { if (!1 === i.configurable) return; r = i.get, o = i.set, r && !o || arguments.length !== 2 || (e = n[t]); }an(e), E(n, t, { get() { let o = r ? r.call(n) : e; return t !== q && tn(o) ? o.value : o; }, set(i) { r && !o || (t !== q && tn(e) && !tn(i) ? e.value = i : o ? (o.call(n, i), e = i) : e = i, an(i)); } }); } } function ln(n) { let t; let e = m(); e.observable ? t = e.observable(n) : t = z(e, { data: { $$state: n } })._data.$$state; return C(t, '__ob__') || sn(t), t; } function sn(n, t) {
        let e, r; if (void 0 === t && (t = new Set()), !t.has(n) && !C(n, '__ob__') && Object.isExtensible(n)) {
            R(n, '__ob__', (function (n) { void 0 === n && (n = {}); return { value: n, dep: { notify: k, depend: k, addSub: k, removeSub: k } }; }(n))), t.add(n); try { for (var i = o(Object.keys(n)), u = i.next(); !u.done; u = i.next()) { let f = n[u.value]; (T(f) || M(f)) && !un(f) && Object.isExtensible(f) && sn(f, t); } }
            catch (n) { e = { error: n }; }
            finally {
                try { u && !u.done && (r = i.return) && r.call(i); }
                finally { if (e) throw e.error; }
            }
        }
    } function vn() { return ln({}).__ob__; } function dn(n) {
        let t, e; if (!B(n)) return n; if (!T(n) && !M(n) || un(n) || !Object.isExtensible(n)) return n; let r = ln(M(n) ? [] : {}); let i = r.__ob__; let u = function (t) { let e; let o; let u = n[t]; let f = Object.getOwnPropertyDescriptor(n, t); if (f) { if (!1 === f.configurable) return 'continue'; e = f.get, o = f.set; }E(r, t, { get() { let n; return (n = i.dep) === null || void 0 === n || n.depend(), u; }, set(t) { let r; e && !o || (N || u !== t) && (o ? o.call(n, t) : u = t, (r = i.dep) === null || void 0 === r || r.notify()); } }); }; try { for (var f = o(Object.keys(n)), a = f.next(); !a.done; a = f.next()) { u(a.value); } }
        catch (n) { t = { error: n }; }
        finally {
            try { a && !a.done && (e = f.return) && e.call(f); }
            finally { if (t) throw t.error; }
        } return r;
    } function pn(n) { if (!B(n)) return n; if (!T(n) && !M(n) || un(n) || !Object.isExtensible(n)) return n; let t = ln(n); return an(t), t; } function yn(n) {
        return function (t, e) {
            let r; let o = W('on'.concat((r = n)[0].toUpperCase() + r.slice(1)), e); return o && (function (n, t, e, r) {
                let o = t.proxy.$options; let f = n.config.optionMergeStrategies[e]; let a = (function (n, t) {
                    return function () {
                        for (var e = [], r = 0; r < arguments.length; r++)e[r] = arguments[r]; let o = $(); w(n); try { return t.apply(void 0, u([], i(e), !1)); }
                        finally { w(o); }
                    };
                }(t, r)); return o[e] = f(o[e], a), a;
            }(g(), o, n, t));
        };
    } let _n; let hn = yn('beforeMount'); let bn = yn('mounted'); let gn = yn('beforeUpdate'); let mn = yn('updated'); let wn = yn('beforeDestroy'); let $n = yn('destroyed'); let jn = yn('errorCaptured'); let xn = yn('activated'); let On = yn('deactivated'); let Sn = yn('serverPrefetch'); function kn() { Cn(this, K); } function En() { Cn(this, Q); } function Rn() { let n = s(); return n ? (function (n) { return void 0 !== n[K]; }(n)) || (function (n) { n[K] = [], n[Q] = [], n.$on('hook:beforeUpdate', kn), n.$on('hook:updated', En); }(n)) : (_n || (_n = z(g())), n = _n), n; } function Cn(n, t) { for (var e = n[t], r = 0; r < e.length; r++)e[r](); e.length = 0; } function Mn(n, t, e) { let r = function () { n.$nextTick(() => { n[K].length && Cn(n, K), n[Q].length && Cn(n, Q); }); }; switch (e) { case 'pre': r(), n[K].push(t); break; case 'post': r(), n[Q].push(t); break; default: !(function (n, t) { if (!n) throw new Error('[vue-composition-api] '.concat(t)); }(!1, 'flush must be one of ["post", "pre", "sync"], but got '.concat(e))); } } function Pn(n, t) { let e = n.teardown; n.teardown = function () { for (var r = [], o = 0; o < arguments.length; o++)r[o] = arguments[o]; e.apply(n, r), t(); }; } function Dn(n, t, e, r) {
        let o; let f; let a = r.flush; let c = a === 'sync'; let l = function (n) {
            f = function () {
                try { n(); }
                catch (n) { !(function (n, t, e) { if (typeof window == 'undefined' || typeof console == 'undefined') throw n; console.error(n); }(n)); }
            };
        }; let s = function () { f && (f(), f = null); }; let v = function (t) { return c || n === _n ? t : function () { for (var e = [], r = 0; r < arguments.length; r++)e[r] = arguments[r]; return Mn(n, () => { t.apply(void 0, u([], i(e), !1)); }, a); }; }; if (e === null) {
            let d = !1; let p = (function (n, t, e, r) { let o = n._watchers.length; return n.$watch(t, e, { immediate: r.immediateInvokeCallback, deep: r.deep, lazy: r.noRun, sync: r.sync, before: r.before }), n._watchers[o]; }(n, () => {
                if (!d) {
                    try { d = !0, t(l); }
                    finally { d = !1; }
                }
            }, k, { deep: r.deep || !1, sync: c, before: s })); Pn(p, s), p.lazy = !1; let y = p.get.bind(p); return p.get = v(y), function () { p.teardown(); };
        } let _; let h = r.deep; let b = !1; if (tn(t) ? _ = function () { return t.value; } : fn(t) ? (_ = function () { return t; }, h = !0) : M(t) ? (b = !0, _ = function () { return t.map((n) => { return tn(n) ? n.value : fn(n) ? Un(n) : V(n) ? n() : k; }); }) : _ = V(t) ? t : k, h) { let g = _; _ = function () { return Un(g()); }; } let m = function (n, t) { if (h || !b || !n.every((n, e) => { return r = n, o = t[e], r === o ? r !== 0 || 1 / r == 1 / o : r != r && o != o; let r, o; })) return s(), e(n, t, l); }; let w = v(m); if (r.immediate) { let $ = w; let j = function (n, t) { return j = $, m(n, M(n) ? [] : t); }; w = function (n, t) { return j(n, t); }; } let x = n.$watch(_, w, { immediate: r.immediate, deep: h, sync: c }); let O = n._watchers[n._watchers.length - 1]; return fn(O.value) && ((o = O.value.__ob__) === null || void 0 === o ? void 0 : o.dep) && h && O.value.__ob__.dep.addSub({ update() { O.run(); } }), Pn(O, s), function () { x(); };
    } function An(n, t) { let e = (function (n) { return r({ flush: 'pre' }, n); }(t)); return Dn(Rn(), n, null, e); } function Un(n, t) {
        if (void 0 === t && (t = new Set()), !B(n) || t.has(n) || H.has(n)) return n; if (t.add(n), tn(n)) {
            Un(n.value, t);
        }
        else if (M(n)) {
            for (let e = 0; e < n.length; e++)Un(n[e], t);
        }
        else if (A(n) === '[object Set]' || (function (n) { return A(n) === '[object Map]'; }(n))) {
            n.forEach((n) => { Un(n, t); });
        }
        else if (T(n)) {
            for (let r in n)Un(n[r], t);
        } return n;
    } let Bn = {}; function Tn(n, t) { for (let e = t; e;) { if (e._provided && C(e._provided, n)) return e._provided[n]; e = e.$parent; } return Bn; } let Vn = {}; let Wn = function (n) { let t; void 0 === n && (n = '$style'); let e = $(); if (!e) return Vn; let r = (t = e.proxy) === null || void 0 === t ? void 0 : t[n]; return r || Vn; }; let zn = Wn; let Fn; function In() { return $().setupContext; } let Kn = { set(n, t, e) { (n.__composition_api_state__ = n.__composition_api_state__ || {})[t] = e; }, get(n, t) { return (n.__composition_api_state__ || {})[t]; } }; function Qn(n) { let t = Kn.get(n, 'rawBindings') || {}; if (t && Object.keys(t).length) { for (var e = n.$refs, r = Kn.get(n, 'refs') || [], o = 0; o < r.length; o++) { var i = t[a = r[o]]; !e[a] && i && tn(i) && (i.value = null); } let u = Object.keys(e); let f = []; for (o = 0; o < u.length; o++) { var a; i = t[a = u[o]]; e[a] && i && tn(i) && (i.value = e[a], f.push(a)); }Kn.set(n, 'refs', f); } } function qn(n) {
        for (let t = [n._vnode]; t.length;) {
            let e = t.pop(); if (e && (e.context && Qn(e.context), e.children)) {
                for (let r = 0; r < e.children.length; ++r)t.push(e.children[r]);
            }
        }
    } function Gn(n, t) {
        let e, r; if (n) {
            let i = Kn.get(n, 'attrBindings'); if (i || t) {
                if (!i) { let u = pn({}); i = { ctx: t, data: u }, Kn.set(n, 'attrBindings', i), E(t, 'attrs', { get() { return i == null ? void 0 : i.data; }, set() {} }); } let f = n.$attrs; let a = function (t) { C(i.data, t) || E(i.data, t, { get() { return n.$attrs[t]; } }); }; try { for (var c = o(Object.keys(f)), l = c.next(); !l.done; l = c.next()) { a(l.value); } }
                catch (n) { e = { error: n }; }
                finally {
                    try { l && !l.done && (r = c.return) && r.call(c); }
                    finally { if (e) throw e.error; }
                }
            }
        }
    } function Hn(n, t) {
        let e = n.$options._parentVnode; if (e) {
            for (var r = Kn.get(n, 'slots') || [], o = (function (n, t) {
                    let e; if (n) { if (n._normalized) return n._normalized; for (var r in e = {}, n)n[r] && r[0] !== '$' && (e[r] = !0); }
                    else {
                        e = {};
                    } for (var r in t)r in e || (e[r] = !0); return e;
                }(e.data.scopedSlots, n.$slots)), i = 0; i < r.length; i++) { o[f = r[i]] || delete t[f]; } let u = Object.keys(o); for (i = 0; i < u.length; i++) { var f; t[f = u[i]] || (t[f] = F(n, f)); }Kn.set(n, 'slots', u);
        }
    } function Jn(n, t, e) {
        let r = $(); w(n); try { return t(n); }
        catch (n) { if (!e) throw n; e(n); }
        finally { w(r); }
    } function Ln(n) {
        function t(n, e) { if (void 0 === e && (e = new Set()), !e.has(n) && T(n) && !tn(n) && !fn(n) && !un(n)) { let r = g().util.defineReactive; Object.keys(n).forEach((o) => { let i = n[o]; r(n, o, i), i && (e.add(i), t(i, e)); }); } } function e(n, t) { return void 0 === t && (t = new Map()), t.has(n) ? t.get(n) : (t.set(n, !1), M(n) && fn(n) ? (t.set(n, !0), !0) : !(!T(n) || un(n) || tn(n)) && Object.keys(n).some((r) => { return e(n[r], t); })); }n.mixin({ beforeCreate() {
            let n = this; let r = n.$options; let o = r.setup; let i = r.render; i && (r.render = function () { for (var t = this, e = [], r = 0; r < arguments.length; r++)e[r] = arguments[r]; return Jn(x(n), () => { return i.apply(t, e); }); }); if (!o) return; if (!V(o)) return; let u = r.data; r.data = function () {
                return (function (n, r) {
                    void 0 === r && (r = {}); let o; let i = n.$options.setup; let u = (function (n) { let t = { slots: {} }; let e = ['emit']; return ['root', 'parent', 'refs', 'listeners', 'isServer', 'ssrContext'].forEach((e) => { let r = '$'.concat(e); E(t, e, { get() { return n[r]; }, set() {} }); }), Gn(n, t), e.forEach((e) => { let r = '$'.concat(e); E(t, e, { get() { return function () { for (var t = [], e = 0; e < arguments.length; e++)t[e] = arguments[e]; n[r].apply(n, t); }; } }); }), t; }(n)); let f = x(n); if (f.setupContext = u, R(r, '__ob__', vn()), Hn(n, u.slots), Jn(f, () => { o = i(r, u); }), !o) return; if (V(o)) { let a = o; return void (n.$options.render = function () { return Hn(n, u.slots), Jn(f, () => { return a(); }); }); } if (B(o)) {
                        fn(o) && (o = rn(o)), Kn.set(n, 'rawBindings', o); let c = o; Object.keys(c).forEach((r) => {
                            let o = c[r]; if (!tn(o)) {
                                if (fn(o)) {
                                    M(o) && (o = nn(o));
                                }
                                else if (V(o)) { let i = o; o = o.bind(n), Object.keys(i).forEach((n) => { o[n] = i[n]; }); }
                                else {
                                    B(o) ? e(o) && t(o) : o = nn(o);
                                }
                            }!(function (n, t, e) { let r = n.$options.props; t in n || r && C(r, t) || (tn(e) ? E(n, t, { get() { return e.value; }, set(n) { e.value = n; } }) : E(n, t, { get() { return fn(e) && e.__ob__.dep.depend(), e; }, set(n) { e = n; } })); }(n, r, o));
                        });
                    }
                }(n, n.$props)), V(u) ? u.call(n, n) : u || {};
            };
        }, mounted() { qn(this); }, beforeUpdate() { Gn(this); }, updated() { qn(this); } });
    } function Nn(n, t) { if (!n) return t; if (!t) return n; for (var e, r, o, i = S ? Reflect.ownKeys(n) : Object.keys(n), u = 0; u < i.length; u++)(e = i[u]) !== '__ob__' && (r = t[e], o = n[e], C(t, e) ? r !== o && T(r) && !tn(r) && T(o) && !tn(o) && Nn(o, r) : t[e] = o); return t; } function Xn(n) { (function (n) { return p && C(n, h); })(n) || (n.config.optionMergeStrategies.setup = function (n, t) { return function (e, r) { return Nn(V(n) ? n(e, r) || {} : void 0, V(t) ? t(e, r) || {} : void 0); }; }, (function (n) { p = n, Object.defineProperty(n, h, { configurable: !0, writable: !0, value: !0 }); }(n)), Ln(n)); } let Yn = { install(n) { return Xn(n); } }; typeof window != 'undefined' && window.Vue && window.Vue.use(Yn), n.EffectScope = c, n.computed = function (n) {
        let t; let e; let r; let o; let i = s(); if (V(n) ? t = n : (t = n.get, e = n.set), i && !i.$isServer) { let u; let f = (function () { if (!P) { let n = z(g(), { computed: { value() { return 0; } } }); let t = n._computedWatchers.value.constructor; let e = n._data.__ob__.dep.constructor; P = { Watcher: t, Dep: e }, n.$destroy(); } return P; }()); let a = f.Watcher; let c = f.Dep; o = function () { return u || (u = new a(i, t, k, { lazy: !0 })), u.dirty && u.evaluate(), c.target && u.depend(), u.value; }, r = function (n) { e && e(n); }; }
        else { let l = z(g(), { computed: { $$state: { get: t, set: e } } }); i && i.$on('hook:destroyed', () => { return l.$destroy(); }), o = function () { return l.$$state; }, r = function (n) { l.$$state = n; }; } return Z({ get: o, set: r }, !e, !0);
    }, n.createApp = function (n, t) { void 0 === t && (t = void 0); let e = g(); let o = void 0; let i = {}; var u = { config: e.config, use: e.use.bind(e), mixin: e.mixin.bind(e), component: e.component.bind(e), provide(n, t) { return i[n] = t, this; }, directive(n, t) { return t ? (e.directive(n, t), u) : e.directive(n); }, mount(u, f) { return o || ((o = new e(r(r({ propsData: t }, n), { provide: r(r({}, i), n.provide) }))).$mount(u, f), o); }, unmount() { o && (o.$destroy(), o = void 0); } }; return u; }, n.createRef = Z, n.customRef = function (n) { let t = nn(0); return Z(n(() => { t.value; }, () => { ++t.value; })); }, n.default = Yn, n.defineAsyncComponent = function (n) { V(n) && (n = { loader: n }); let t = n.loader; let e = n.loadingComponent; let r = n.errorComponent; let o = n.delay; let i = void 0 === o ? 200 : o; let u = n.timeout; n.suspensible; let f = n.onError; let a = null; let c = 0; let l = function () { let n; return a || (n = a = t().catch((n) => { if (n = n instanceof Error ? n : new Error(String(n)), f) return new Promise((t, e) => { f(n, () => { return t((c++, a = null, l())); }, () => { return e(n); }, c + 1); }); throw n; }).then((t) => { return n !== a && a ? a : (t && (t.__esModule || t[Symbol.toStringTag] === 'Module') && (t = t.default), t); })); }; return function () { return { component: l(), delay: i, timeout: u, error: r, loading: e }; }; }, n.defineComponent = function (n) { return n; }, n.del = function (n, t) {
        if (g().util.warn, M(n) && U(t)) {
            n.splice(t, 1);
        }
        else { let e = n.__ob__; n._isVue || e && e.vmCount || C(n, t) && (delete n[t], e && e.dep.notify()); }
    }, n.effectScope = function (n) { return new c(n); }, n.getCurrentInstance = $, n.getCurrentScope = l, n.h = function () { for (var n, t = [], e = 0; e < arguments.length; e++)t[e] = arguments[e]; let r = (this == null ? void 0 : this.proxy) || ((n = $()) === null || void 0 === n ? void 0 : n.proxy); return r ? r.$createElement.apply(r, t) : (Fn || (Fn = z(g()).$createElement), Fn.apply(Fn, t)); }, n.inject = function (n, t, e) { let r; void 0 === e && (e = !1); let o = (r = $()) === null || void 0 === r ? void 0 : r.proxy; if (o) { if (!n) return t; let i = Tn(n, o); return i !== Bn ? i : arguments.length > 1 ? e && V(t) ? t() : t : void 0; } }, n.isRaw = un, n.isReactive = fn, n.isReadonly = function (n) { return J.has(n); }, n.isRef = tn, n.markRaw = function (n) { if (!T(n) && !M(n) || !Object.isExtensible(n)) return n; let t = vn(); return t.__v_skip = !0, R(n, '__ob__', t), H.set(n, !0), n; }, n.nextTick = function () { for (var n, t = [], e = 0; e < arguments.length; e++)t[e] = arguments[e]; return (n = g()) === null || void 0 === n ? void 0 : n.nextTick.apply(this, t); }, n.onActivated = xn, n.onBeforeMount = hn, n.onBeforeUnmount = wn, n.onBeforeUpdate = gn, n.onDeactivated = On, n.onErrorCaptured = jn, n.onMounted = bn, n.onScopeDispose = function (n) { e && e.cleanups.push(n); }, n.onServerPrefetch = Sn, n.onUnmounted = $n, n.onUpdated = mn, n.provide = function (n, t) { let e; let r = (e = W()) === null || void 0 === e ? void 0 : e.proxy; if (r) { if (!r._provided) { let o = {}; E(r, '_provided', { get() { return o; }, set(n) { return Object.assign(o, n); } }); }r._provided[n] = t; } }, n.proxyRefs = function (n) {
        let t, e, r; if (fn(n)) return n; let i = pn(((t = {})[q] = n, t)); R(i, q, i[q], !1); let u = function (n) { E(i, n, { get() { return tn(i[q][n]) ? i[q][n].value : i[q][n]; }, set(t) { if (tn(i[q][n])) return i[q][n].value = en(t); i[q][n] = en(t); } }); }; try { for (var f = o(Object.keys(n)), a = f.next(); !a.done; a = f.next()) { u(a.value); } }
        catch (n) { e = { error: n }; }
        finally {
            try { a && !a.done && (r = f.return) && r.call(f); }
            finally { if (e) throw e.error; }
        } return i;
    }, n.reactive = pn, n.readonly = function (n) { return J.set(n, !0), n; }, n.ref = nn, n.set = L, n.shallowReactive = dn, n.shallowReadonly = function (n) {
        let t, e; if (!B(n)) return n; if (!T(n) && !M(n) || !Object.isExtensible(n) && !tn(n)) return n; let r = tn(n) ? new Y({}) : fn(n) ? ln({}) : {}; let i = pn({}).__ob__; let u = function (t) { let e; let o = n[t]; let u = Object.getOwnPropertyDescriptor(n, t); if (u) { if (!1 === u.configurable && !tn(n)) return 'continue'; e = u.get; }E(r, t, { get() { let t = e ? e.call(n) : o; return i.dep.depend(), t; }, set(n) {} }); }; try { for (var f = o(Object.keys(n)), a = f.next(); !a.done; a = f.next()) { u(a.value); } }
        catch (n) { t = { error: n }; }
        finally {
            try { a && !a.done && (e = f.return) && e.call(f); }
            finally { if (t) throw t.error; }
        } return J.set(r, !0), r;
    }, n.shallowRef = function (n) { let t; if (tn(n)) return n; let e = dn(((t = {})[q] = n, t)); return Z({ get() { return e[q]; }, set(n) { return e[q] = n; } }); }, n.toRaw = function (n) { let t; return un(n) || !Object.isExtensible(n) ? n : ((t = n == null ? void 0 : n.__ob__) === null || void 0 === t ? void 0 : t.value) || n; }, n.toRef = on, n.toRefs = rn, n.triggerRef = function (n) { tn(n) && (X(!0), n.value = n.value, X(!1)); }, n.unref = en, n.useAttrs = function () { return In().attrs; }, n.useCSSModule = zn, n.useCssModule = Wn, n.useSlots = function () { return In().slots; }, n.version = '1.7.2', n.warn = function (n) { let t, e, r, o; e = n, r = (t = $()) === null || void 0 === t ? void 0 : t.proxy, (o = m()) && o.util ? o.util.warn(e, r) : console.warn('[vue-composition-api] '.concat(e)); }, n.watch = function (n, t, e) { let o = null; V(t) ? o = t : (e = t, o = null); let i = (function (n) { return r({ immediate: !1, deep: !1, flush: 'pre' }, n); }(e)); return Dn(Rn(), n, o, i); }, n.watchEffect = An, n.watchPostEffect = function (n) { return An(n, { flush: 'post' }); }, n.watchSyncEffect = function (n) { return An(n, { flush: 'sync' }); }, Object.defineProperty(n, '__esModule', { value: !0 });
}));

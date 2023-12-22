import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { terser } from 'rollup-plugin-terser';
import dts from 'vite-plugin-dts';
import pkgJson from './package.json';

const external = ['vue', 'element-plus'];
const globals = { vue: 'Vue', 'element-plus': 'ElementPlus' };
// @ts-ignore
const pkg = pkgJson.publishConfig || pkgJson;

/**
 * 添加或删除名称中的 min
 * @param {string} name
 * @param {boolean} flag
 */
function retainMinSuffix(name: string, flag: boolean) {
    const _name = name.replace(/^dist\//, '').replace(/min/, '');
    return flag ? _name.replace(/(.*)(\..*)$/, '$1.min$2') : _name;
}

/**
 * @file vite 环境配置
 */
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        dts({
            // rollupTypes: true,
        }),
    ],
    optimizeDeps: {
        exclude: ['vue-demi'],
    },
    build: {
        lib: {
            entry: resolve(__dirname, './index.ts'),
            name: 'HCondition',
            fileName: 'index',
        },
        outDir: 'dist',
        rollupOptions: {
            external,
            output: [
                { entryFileNames: retainMinSuffix(pkg.module, false), format: 'es', sourcemap: true },
                {
                    entryFileNames: retainMinSuffix(pkg.module, true),
                    format: 'es',
                    sourcemap: true,
                    plugins: [terser({ format: { comments: false } })],
                },
                {
                    entryFileNames: retainMinSuffix(pkg.main, false),
                    format: 'cjs',
                    exports: 'named',
                    sourcemap: true,
                },
                {
                    entryFileNames: retainMinSuffix(pkg.main, true),
                    format: 'cjs',
                    exports: 'named',
                    sourcemap: true,
                    plugins: [terser({ format: { comments: false } })],
                },
                {
                    entryFileNames: retainMinSuffix(pkg.unpkg, false),
                    format: 'umd',
                    name: 'HCondition',
                    sourcemap: true,
                    globals,
                },
                {
                    entryFileNames: retainMinSuffix(pkg.unpkg, true),
                    format: 'umd',
                    name: 'HCondition',
                    sourcemap: true,
                    globals: globals,
                    plugins: [terser({ format: { comments: false } })],
                },
            ],
        },
    },
});

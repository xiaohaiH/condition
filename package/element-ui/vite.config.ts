import { resolve } from 'path';
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { terser } from 'rollup-plugin-terser';
import dts from 'vite-plugin-dts';
import pkgJson from './package.json';

const external = ['vue', 'vue-demi', 'element-ui'];
const globals = { vue: 'Vue', 'vue-demi': 'VueDemi', 'element-ui': 'ELEMENT' };
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
        createVuePlugin({
            jsx: true,
        }),
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
        minify: true,
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            external,
            output: [
                { entryFileNames: retainMinSuffix(pkg.module, false), format: 'es' },
                {
                    entryFileNames: retainMinSuffix(pkg.module, true),
                    format: 'es',
                    plugins: [terser({ format: { comments: false } })],
                },
                {
                    entryFileNames: retainMinSuffix(pkg.main, true),
                    format: 'cjs',
                    exports: 'named',
                    plugins: [terser({ format: { comments: false } })],
                },
                {
                    entryFileNames: retainMinSuffix(pkg.unpkg, false),
                    format: 'umd',
                    name: 'HCondition',
                    globals,
                    // plugins: [terser({ compress: false })],
                },
                {
                    entryFileNames: retainMinSuffix(pkg.unpkg, true),
                    format: 'umd',
                    name: 'HCondition',
                    globals: globals,
                    plugins: [terser({ format: { comments: false } })],
                },
            ],
        },
    },
});

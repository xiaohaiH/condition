import { resolve } from 'path';
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const external = ['vue', 'vue-demi', 'element-ui'];
const globals = { vue: 'Vue', 'vue-demi': 'VueDemi', 'element-ui': 'ELEMENT' };

/**
 * 添加获删除名称中的 min
 * @param {string} name
 * @param {boolean} flag
 */
function retainMinSuffix(name: string, flag: boolean) {
    const _name = name.replace(/min/, '');
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
                { file: retainMinSuffix(pkg.module, false), format: 'es', sourcemap: true, dir: undefined },
                {
                    file: retainMinSuffix(pkg.module, true),
                    format: 'es',
                    sourcemap: true,
                    dir: undefined,
                    // @ts-ignore
                    plugins: [terser({ format: { comments: false } })],
                },
                {
                    file: retainMinSuffix(pkg.main, false),
                    format: 'cjs',
                    exports: 'named',
                    sourcemap: true,
                    dir: undefined,
                },
                {
                    file: retainMinSuffix(pkg.main, true),
                    format: 'cjs',
                    exports: 'named',
                    sourcemap: true,
                    dir: undefined,
                    // @ts-ignore
                    plugins: [terser({ format: { comments: false } })],
                },
                {
                    file: retainMinSuffix(pkg.unpkg, false),
                    format: 'umd',
                    name: 'HCondition',
                    sourcemap: true,
                    globals,
                    dir: undefined,
                },
                {
                    file: retainMinSuffix(pkg.unpkg, true),
                    format: 'umd',
                    name: 'HCondition',
                    sourcemap: true,
                    globals: globals,
                    dir: undefined,
                    // @ts-ignore
                    plugins: [terser({ format: { comments: false } })],
                },
            ],
        },
    },
});

import { resolve } from 'path';
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { terser } from 'rollup-plugin-terser';

const external = ['vue', 'vue-demi'];
const globals = { vue: 'Vue', 'vue-demi': 'VueDemi' };

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
                { file: 'dist/index.esm.js', format: 'es', sourcemap: true, dir: undefined },
                {
                    file: 'dist/index.esm.min.js',
                    format: 'es',
                    sourcemap: true,
                    dir: undefined,
                    // @ts-ignore
                    plugins: [terser({ format: { comments: false } })],
                },
                { file: 'dist/index.cjs.js', format: 'cjs', exports: 'named', sourcemap: true, dir: undefined },
                {
                    file: 'dist/index.cjs.min.js',
                    format: 'cjs',
                    exports: 'named',
                    sourcemap: true,
                    dir: undefined,
                    // @ts-ignore
                    plugins: [terser({ format: { comments: false } })],
                },
                {
                    file: 'dist/index.umd.js',
                    format: 'umd',
                    name: 'HCondition',
                    sourcemap: true,
                    globals,
                    dir: undefined,
                },
                {
                    file: 'dist/index.umd.min.js',
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

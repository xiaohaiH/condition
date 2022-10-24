import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { createHtmlPlugin } from 'vite-plugin-html';

/**
 * @file vue2 环境配置
 */
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        createVuePlugin({
            jsx: true,
        }),
        createHtmlPlugin({
            entry: 'src/main2.ts',
        }),
    ],
    optimizeDeps: {
        exclude: ['vue-demi'],
    },
    // esbuild: {
    //     jsxFactory: 'h',
    //     jsxFragment: 'Fragment',
    //     jsxInject: "import { h } from 'vue-demi';",
    // },
});

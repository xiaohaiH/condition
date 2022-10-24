import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';

/**
 * @file vue3 环境配置
 */
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        createHtmlPlugin({
            entry: 'src/main.ts',
        }),
    ],
    optimizeDeps: {
        exclude: ['vue-demi'],
    },
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        jsxInject: "import { h } from 'vue';",
    },
});

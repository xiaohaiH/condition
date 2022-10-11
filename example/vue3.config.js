import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

/**
 * vue3 环境配置
 */
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    optimizeDeps: {
        exclude: ['vue-demi'],
    },
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        jsxInject: "import { h } from 'vue';",
    },
});

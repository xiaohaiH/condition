import { defineConfig } from 'vite';
import { isVue2 } from 'vue-demi';
// import vue from '@vitejs/plugin-vue';
// import { createVuePlugin } from 'vite-plugin-vue2';

// https://vitejs.dev/config/
export default defineConfig(async (env) => {
    let func: any;
    if (isVue2) {
        try {
            // @ts-ignore
            const { createVuePlugin } = (await import('vite-plugin-vue2')).default;
            func = createVuePlugin;
        } catch (error) {
            console.log('vue2 error', error);
        }
    } else {
        try {
            // @ts-ignore
            func = (await import('@vitejs/plugin-vue')).default;
        } catch (error) {
            console.log('vue3 error', error);
        }
    }

    return {
        plugins: [func()],
        optimizeDeps: {
            exclude: ['vue-demi'],
        },
        ...(isVue2
            ? {
                  esbuild: {
                      jsxFactory: 'h',
                      jsxFragment: 'Fragment',
                  },
              }
            : {
                  esbuild: {
                      jsxFactory: 'h',
                      jsxFragment: 'Fragment',
                      jsxInject: "import { h } from 'vue';",
                  },
              }),
    };
});

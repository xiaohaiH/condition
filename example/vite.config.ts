import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { createHtmlPlugin } from 'vite-plugin-html';

/**
 * @file vue3 环境配置
 */
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        createHtmlPlugin({
            entry: 'src/main.ts',
        }),
        myPlugin(),
    ],
    define: {
        'process.env': { BABEL_TYPES_8_BREAKING: false },
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
        },
    },
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment',
        jsxInject: "import { h } from 'vue';",
    },
    preview: {
        open: '/example/static/index.html',
    },
    build: {
        lib: {
            entry: `${import.meta.url.split('/').slice(0, -1).join('/').slice(8)}/src/App.vue`,
            name: 'Content',
            formats: ['es', 'cjs', 'umd', 'iife'],
        },
        watch: {
            buildDelay: 2000,
            clearScreen: true,
        },
        outDir: 'dist',
        rollupOptions: {
            external: /^(chalk|vue-demi|monaco-editor)/,
            // external: /^(@babel\/traverse|@babel\/generator|vue-demi|monaco-editor|@xiaohaih\/vue-monaco-editor)/,
            output: {
                globals: {
                    'monaco-editor': 'monaco',
                    'vue-demi': 'VueDemi',
                    // 'monaco-editor/esm/vs/language/typescript/ts.worker?worker': 'tsWorker',
                    // 'monaco-editor/esm/vs/editor/editor.worker?worker': 'editorWorker',
                },
            },
        },
    },
});

/** 抹平 vue2.*, vue2.7.*, vue3的差异 */
function myPlugin() {
    const virtualModuleId = `virtual:package`;
    const resolvedVirtualModuleId = '\0' + virtualModuleId;

    const template = {
        Vue: [
            `import * as Vue from 'vue';`,
            `window.Vue = { ...Vue };`,
            `window.Vue.set = (a, b, c) => a[b] = c;`,
        ].join('\n'),
        Condition: [`import * as condition from '@xiaohaih/condition-el-plus';`, `window.HCondition = condition;`].join(
            '\n',
        ),
        Ui: [`import { ElMessage } from 'element-plus';`, `window.Ui = { toast: ElMessage }`].join('\n'),
    };

    return {
        name: `my-plugin`,
        resolveId(id: string) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        load(id: string) {
            if (id === resolvedVirtualModuleId) {
                return Object.values(template).join('\n');
            }
        },
    };
}

import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { createHtmlPlugin } from 'vite-plugin-html';
import Vue from 'vue';

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
        myPlugin(),
    ],
    define: {
        'process.env': { BABEL_TYPES_8_BREAKING: false },
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm.js',
        },
    },
    // esbuild: {
    //     jsxFactory: 'h',
    //     jsxFragment: 'Fragment',
    //     jsxInject: "import { h } from 'vue-demi';",
    // },
    build: {
        lib: {
            entry: `${import.meta.url.split('/').slice(0, -1).join('/').slice(8)}/src/App.vue`,
            name: 'Content',
            formats: ['es', 'cjs', 'umd', 'iife'],
        },
        // watch: {
        //     buildDelay: 2000,
        //     clearScreen: true,
        // },
        outDir: 'dist',
        rollupOptions: {
            external: /^(chalk|vue-demi|monaco-editor)/,
            // external: /^(@babel\/traverse|@babel\/generator|vue-demi|monaco-editor|@xiaohaih\/vue-monaco-editor)/,
            output: {
                globals: {
                    'monaco-editor': 'monaco',
                    'vue-demi': 'VueDemi',
                },
            },
        },
    },
});

/** 抹平 vue2.*, vue2.7.*, vue3的差异 */
function myPlugin() {
    const virtualModuleId = 'virtual:package';
    const resolvedVirtualModuleId = '\0' + virtualModuleId;

    const vueVersion = (Vue as any).version as string;

    const template = {
        Vue: [`import * as Vue from 'vue';`, `window.Vue = { ...Vue };`].join('\n'),
        Condition: [`import * as condition from '@xiaohaih/condition-el';`, `window.HCondition = condition;`].join(
            '\n',
        ),
        Ui: [`import { Message } from 'element-ui';`, `window.Ui = { toast: Message }`].join('\n'),
    };
    if (!vueVersion.startsWith('2.7.')) {
        template.Vue = [
            `import Vue from 'vue';`,
            'console.log(111)',
            `window.Vue = { ...Vue, version: Vue.version };`,
            `import * as VueCompositionAPI from '@vue/composition-api'`,
            `for (var key in VueCompositionAPI) {`,
            `if (Object.hasOwnProperty.call(VueCompositionAPI, key)) {`,
            `window.Vue[key] || (window.Vue[key] = VueCompositionAPI[key]);`,
            `}`,
            `}`,
        ].join('\n');
    }

    return {
        name: 'my-plugin',
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

<script lang="ts">
import './buffer';
import { conditionFactory } from './config';
import traverse, { type Node } from '@babel/traverse';
import generator from '@babel/generator';
import { VueMonacoEditor } from '@xiaohaih/vue-monaco-editor';
import { typescript as monacoPluginTypescript } from '@xiaohaih/vue-monaco-editor/src/typescript';
import { languages } from 'monaco-editor';

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

const { defineComponent, nextTick, onMounted, ref, set, version } = window.Vue;
const { HWrapper } = window.HCondition;
const { toast } = window.Ui;

const unspecialKeyReg = /^[a-z_][a-z_0-9]*$/i;
const isAttrFunctionReg = /^(function\s|((\(.*\)|[_a-z0-9]+)\s?=>))/i;
function toStr(value: any, level = 1) {
    const startSign = ''.padStart(level * 4, ' ');
    const endSign = ''.padStart((level - 1) * 4, ' ');
    switch (Object.prototype.toString.call(value).slice(8, -1)) {
        case 'Object': {
            let r = '{';
            let tt: string, tt2: string;
            Object.keys(value).forEach((o) => {
                tt = toStr(value[o], level + 1);
                tt2 = unspecialKeyReg.test(o) ? o : `'${o}'`;
                r += `\n${startSign}${
                    typeof value[o] === 'function' && !(tt.slice(0, 9) === 'function ' || isAttrFunctionReg.test(tt))
                        ? ''
                        : `${tt2}: `
                }${tt},`;
            });
            r += r.length === 1 ? `}` : `\n${endSign}}`;
            return r;
        }
        case 'Array': {
            let r = `[`;
            value.forEach((o: any) => {
                r += `\n${startSign}${toStr(o, level + 1)},`;
            });
            r += r.length === 1 ? ']' : `\n${endSign}]`;
            return r;
        }
        case 'Function': {
            return value.toString();
        }
        case 'String': {
            return `'${value}'`;
        }
        case 'Number': {
            return value.toString();
        }
        default: {
            return value?.toString();
        }
    }
}

self.MonacoEnvironment = {
    getWorker(_, label) {
        // if (label === 'json') {
        //     return new jsonWorker();
        // }
        // if (label === 'css' || label === 'scss' || label === 'less') {
        //     return new cssWorker();
        // }
        // if (label === 'html' || label === 'handlebars' || label === 'razor') {
        //     return new htmlWorker();
        // }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker();
        }
        return new editorWorker();
    },
};

let flag = false;
function initLanguages() {
    if (flag) return;
    flag = true;
    languages.typescript.typescriptDefaults.setCompilerOptions({
        allowNonTsExtensions: true,
        moduleResolution: languages.typescript.ModuleResolutionKind.NodeJs,
        module: languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        // isolatedModules: true,
        // moduleDetection: 'force',
        // jsx: languages.typescript.JsxEmit.React,
        // jsxFactory: 'JSXAlone.createElement',
    });
}

/** @file 显示的条件 */
export default defineComponent({
    template: `
        <ElCard class="box">
            <div>
                <ElAlert type="success" :closable="false">
                    <span>当前条件:　</span>
                    <span>{{ conditions.query }}</span>
                </ElAlert>
                <div style="margin: 10px 0; display: flex; flex-flow: row wrap">
                    <ElButton @click="clear" type="danger" size="small">清空所有条件并重置</ElButton>
                    <ElButton
                        v-if="!!conditions.setQuery"
                        @click="conditions.setQuery(conditions)"
                        type="primary"
                        size="small"
                    >
                        手动设置query
                    </ElButton>
                    <ElButton style="margin-left: auto" @click="setValue" size="small" type="success">
                        同步编辑器中的条件
                    </ElButton>
                </div>
                <HWrapper
                    :backfill="conditions.query"
                    :datum="conditions.condition"
                    v-bind="conditions.wrapperOption"
                    :key="conditions.wrapperOption.key"
                    @ready="querySearch($event, 'ready')"
                    @search="querySearch($event, 'search')"
                ></HWrapper>
                <!-- @reset="reset($event)" -->
            </div>
            <VueMonacoEditor
                class="vue-monaco-editor"
                ref="editorRef"
                :value="parseToEditorValue(conditions)"
                language="typescript"
            ></VueMonacoEditor>
        </ElCard>
    `,
    components: {
        HWrapper,
        VueMonacoEditor,
    },
    setup() {
        onMounted(initLanguages);

        const conditions = ref(conditionFactory());
        /** 搜索 */
        function querySearch(query: Record<string, string>, source?: string) {
            conditions.value.query = query;
            console.log(`${source}-搜索事件: `, { ...query }, '\n句柄: ', conditions.value);
        }
        /** 重置 */
        function reset(query: Record<string, any>) {
            // query.a = '999';
            // console.log('reset', `a 重置后设置为\`${999}\`了`, query);
            // return;
            conditions.value.query.a = '';
            nextTick(() => {
                conditions.value.query.a = '999';
                console.log('reset', `a 重置后设置为\`${999}\`了`, conditions.value.query);
            });
        }

        function parseToEditorValue({ wrapperOption, condition, query }: any) {
            return [
                '',
                `import { defineCondition, HCondition } from '${
                    version.charAt(0) === '3' ? '@xiaohaih/condition-plus' : '@xiaohaih/condition-el'
                }';`,
                `// 条件容器的配置项`,
                `const wrapper: HCondition.WrapperProps & {`,
                `    class?: string; style?: Record<string, any>;`,
                `    key: string;`,
                `} = ${toStr(wrapperOption)};`,
                `// 当前的条件值`,
                `const query = ${toStr(query)};`,
                `// 条件配置项`,
                `const condition = defineCondition(${toStr(condition)});`,
            ].join('\n');
        }

        const modLoadHelper = [
            [
                '@xiaohaih/condition-core',
                // (modName: string, absolutePath: string, mod: string) =>
                //     `http://localhost:7890/core/dist/${
                //         modName === mod ? 'index.d.ts' : `${absolutePath.slice(mod.length + 1)}.d.ts`
                //     }`,
                (modName: string, absolutePath: string, mod: string) =>
                    `https://fastly.jsdelivr.net/npm/@xiaohaih/condition-core@latest/dist/${
                        modName === mod ? 'index.d.ts' : `${absolutePath.slice(mod.length + 1)}.d.ts`
                    }`,
            ],
            [
                '@xiaohaih/condition-el',
                // (modName: string, absolutePath: string, mod: string) =>
                //     `http://localhost:7890/element-ui/dist/${
                //         modName === mod ? 'index.d.ts' : `${absolutePath.slice(mod.length + 1)}.d.ts`
                //     }`,
                (modName: string, absolutePath: string, mod: string) =>
                    `https://fastly.jsdelivr.net/npm/@xiaohaih/condition-el@latest/dist/${
                        modName === mod ? 'index.d.ts' : `${absolutePath.slice(mod.length + 1)}.d.ts`
                    }`,
            ],
            [
                '@xiaohaih/condition-plus',
                // (modName: string, absolutePath: string, mod: string) =>
                //     `http://localhost:7890/element-plus/dist/${
                //         modName === mod ? 'index.d.ts' : `${absolutePath.slice(mod.length + 1)}.d.ts`
                //     }`,
                (modName: string, absolutePath: string, mod: string) =>
                    `https://fastly.jsdelivr.net/npm/@xiaohaih/condition-el-plus@latest/dist/${
                        modName === mod ? 'index.d.ts' : `${absolutePath.slice(mod.length + 1)}.d.ts`
                    }`,
            ],
            [
                'element-ui',
                (modName: string, absolutePath: string, mod: string) =>
                    `https://fastly.jsdelivr.net/npm/element-ui@latest/types/${
                        modName === mod
                            ? `index.d.ts`
                            : modName === './element-ui'
                            ? `element-ui.d.ts`
                            : absolutePath.slice(0, 'element-ui/types/'.length) === 'element-ui/types/'
                            ? `${absolutePath.slice('element-ui/types/'.length)}.d.ts`
                            : `${absolutePath.slice('element-ui/'.length)}.d.ts`
                    }`,
            ],
            // element-plus 文件夹都省略了路径, 又存在大量重名(同关键字既可以是目录又可以是文件)
            // 所以用 element-ui 的类型
            [
                'element-plus',
                (modName: string, absolutePath: string, mod: string) =>
                    `https://fastly.jsdelivr.net/npm/element-ui@latest/types/${
                        modName === mod
                            ? `index.d.ts`
                            : modName === './element-ui'
                            ? `element-ui.d.ts`
                            : absolutePath.slice(0, 'element-ui/types/'.length) === 'element-ui/types/'
                            ? `${absolutePath.slice('element-ui/types/'.length)}.d.ts`
                            : `${absolutePath.slice('element-plus/'.length)}.d.ts`
                    }`,
            ],
            [
                'vue-demi',
                (modName: string, absolutePath: string, mod: string) =>
                    `https://fastly.jsdelivr.net/npm/vue-demi@0.14.6/lib/v${version.charAt(0)}/index.d.ts`,
            ],
            [
                '@vue/composition-api',
                (modName: string, absolutePath: string, mod: string) =>
                    `https://fastly.jsdelivr.net/npm/@vue/composition-api@1.7.2/dist/vue-composition-api.d.ts`,
            ],
            version.charAt(0) === '3'
                ? ([
                      'vue',
                      (modName: string, absolutePath: string, mod: string) =>
                          `https://fastly.jsdelivr.net/npm/vue@3.4.0-beta.4/dist/${
                              modName === mod
                                  ? `vue.d.ts`
                                  : absolutePath.slice(0, 'vue/types/'.length) === 'vue/types/'
                                  ? `${absolutePath.slice('vue/types/'.length)}.d.ts`
                                  : `${absolutePath.slice('vue/'.length)}.d.ts`
                          }`,
                  ] as const)
                : ([
                      'vue',
                      (modName: string, absolutePath: string, mod: string) =>
                          `https://fastly.jsdelivr.net/npm/vue@2.6.0/types/${
                              modName === mod
                                  ? `index.d.ts`
                                  : absolutePath.slice(0, 'vue/types/'.length) === 'vue/types/'
                                  ? `${absolutePath.slice('vue/types/'.length)}.d.ts`
                                  : `${absolutePath.slice('vue/'.length)}.d.ts`
                          }`,
                  ] as const),
            [
                '@vue/compiler-dom',
                (modName: string, absolutePath: string, mod: string) =>
                    `https://fastly.jsdelivr.net/npm/@vue/compiler-dom@3.4.0-beta.4/dist/compiler-dom.d.ts`,
            ],
            [
                '@vue/shared',
                (modName: string, absolutePath: string, mod: string) =>
                    `https://fastly.jsdelivr.net/npm/@vue/shared@3.4.0-beta.4/dist/shared.d.ts`,
            ],
            [
                '@babel/types',
                (modName: string, absolutePath: string, mod: string) =>
                    `https://fastly.jsdelivr.net/npm/@babel/types@7.23.6/lib/index.d.ts`,
            ],
            [
                'source-map-js',
                (modName: string, absolutePath: string, mod: string) =>
                    `https://fastly.jsdelivr.net/npm/source-map-js@1.0.2/source-map.d.ts`,
            ],
            [
                '@vue/runtime-dom',
                (modName: string, absolutePath: string, mod: string) =>
                    `https://fastly.jsdelivr.net/npm/@vue/runtime-dom@3.4.0-beta.4/dist/runtime-dom.d.ts`,
            ],
            [
                '@vue/runtime-core',
                (modName: string, absolutePath: string, mod: string) =>
                    `https://fastly.jsdelivr.net/npm/@vue/runtime-core@3.4.0-beta.4/dist/runtime-core.d.ts`,
            ],
            [
                '@vue/reactivity',
                (modName: string, absolutePath: string, mod: string) =>
                    `https://fastly.jsdelivr.net/npm/@vue/reactivity@3.4.0-beta.4/dist/reactivity.d.ts`,
            ],
            [
                'csstype',
                (modName: string, absolutePath: string, mod: string) =>
                    `https://fastly.jsdelivr.net/npm/csstype@3.1.3/index.d.ts`,
            ],
        ] as const;
        /** 加载模块 */
        async function loadModule(modName: string, absolutePath: string, cb: any) {
            const r = modLoadHelper.find(([mod]) => absolutePath.slice(0, mod.length) === mod);
            if (!r) return '';
            return fetch(r[1](modName, absolutePath, r[0])).then((v) => {
                return v.text();
            });
        }
        onMounted(() => {
            editorRef.value.editorInfo.addPlugin(monacoPluginTypescript({ loadMod: loadModule }));
        });
        const editorRef = ref<InstanceType<typeof VueMonacoEditor>>([]);
        async function setValue() {
            try {
                await editorRef.value?.editorInfo.validate();
                const ast = editorRef.value.editorInfo.getAst<Node>();
                if (!ast) return;
                traverse(ast, {
                    VariableDeclarator(path) {
                        // @ts-ignore
                        if (path.node.id?.name === 'wrapper') {
                            // @ts-ignore
                            const { code } = generator(path.node.init);
                            let aaa = {};
                            eval(`aaa=${code}`);
                            // @ts-ignore
                            Object.assign(conditions.value.wrapperOption, aaa);
                        }
                        // @ts-ignore
                        if (path.node.id?.name === 'query') {
                            // @ts-ignore
                            const { code } = generator(path.node.init);
                            let aaa = {} as Record<string, any>;
                            eval(`aaa=${code}`);
                            // @ts-ignore
                            Object.assign(conditions.value.query, aaa);
                            // Object.keys(aaa).forEach((key) => {
                            //     set(conditions.value.query, key, aaa[key]);
                            // });
                        }
                        // @ts-ignore
                        if (path.node.id?.name === 'condition') {
                            // @ts-ignore
                            const { code } = generator(path.node.init?.arguments[0], { jsescOption: { wrap: false } });
                            let aaa = {};
                            eval(
                                `aaa=${code.replace(/(\(\{)\n\s*((.|\n|\s)*?)\n*\s*(\}\))/gi, (val) =>
                                    val.replace(/\/\/.*/g, '').replace(/(\n|\s)+/g, ' '),
                                )}`,
                            );
                            // @ts-ignore
                            Object.keys(aaa).forEach((key) => {
                                // @ts-ignore
                                Object.assign(conditions.value.condition[key], aaa[key]);
                            });
                        }
                    },
                });
            } catch (error) {
                toast.warning('同步报错, 打开控制台看报错明细');
                console.error(error);
            }
        }

        function clear() {
            conditions.value.query = {};
            // @ts-ignore
            conditions.value.condition = {};
        }

        return {
            conditions,
            querySearch,
            reset,
            parseToEditorValue,
            loadModule,
            editorRef,
            setValue,
            clear,
            log: console.log,
        };
    },
});
</script>

<style>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* .el-card,
.el-collapse-item__wrap {
    overflow: initial;
} */
.el-card__body {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
}
.box {
    flex: auto;
}

.vue-monaco-editor {
    flex: auto;
}

.el-input {
    width: 150px;
}
.h-condition {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
}
.condition-item {
    margin-right: 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}
.condition-item__label {
    flex: none;
}
.condition-item__label::after {
    content: attr(suffix);
    margin-right: 10px;
}
.condition-item--true {
    margin-right: 4px;
}
.condition-item__postfix {
    margin-left: 3px;
}
</style>

<style>
.gutter {
    background-color: #953a08;
    background-repeat: no-repeat;
    background-position: 50%;
}

.gutter.gutter-horizontal {
    background-image: url('grips/vertical.png');
    cursor: col-resize;
}

.gutter.gutter-vertical {
    background-image: url('grips/horizontal.png');
    cursor: row-resize;
}
.gutter.gutter-vertical {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
}

.gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
}
</style>

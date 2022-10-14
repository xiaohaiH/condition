<template>
    <div>
        <div class="control">
            <button @click="changeComp('')">清空</button>
            <button @click="changeComp('element')">element</button>
        </div>
        <component :is="comp" :class="comp ? 'show-empty-message' : ''"></component>
    </div>
</template>

<script lang="ts">
import { defineComponent, isVue2, markRaw, ref } from 'vue-demi';

async function getComponentMap() {
    // if (isVue2) {
    const result = await Promise.all([import('./components/element-ui.vue')]);
    return {
        element: markRaw(result[0].default),
    };
    // } else {
    //     const result = await Promise.all([import('./components/element-plus.vue')]);
    //     return {
    //         element: markRaw(result[0].default),
    //     };
    // }
}
let componentMap: ComponentMap = {} as ComponentMap;
type GetComponentMap = typeof getComponentMap;
type ComponentMap = GetComponentMap extends () => Promise<infer R> ? R : never;

export default defineComponent({
    setup() {
        const comp = ref<ComponentMap[keyof ComponentMap] | null>(null);
        (async function a() {
            componentMap = await getComponentMap();
            comp.value = componentMap.element;
        })();
        /**
         * 更改显示的组件
         */
        function changeComp(val: keyof typeof componentMap) {
            if (!componentMap.element) {
                alert('组件未加载完成, 稍后再试');
                return;
            }
            if (!val) {
                comp.value = null;
                return;
            }
            if (!componentMap[val]) return;
            comp.value = componentMap[val];
        }

        return {
            comp,
            changeComp,
        };
    },
});
</script>

<style scoped>
.control {
    margin-bottom: 10px;
}
button + button {
    margin-left: 10px;
}
.show-empty-message:empty.show-empty-message::before {
    content: '组件未加载';
}
</style>

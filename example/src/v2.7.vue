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
import { defineComponent, markRaw, ref } from 'vue';
import element from './components/element-ui.2.7.vue';

const componentMap = {
    element: markRaw(element),
};

type ComponentMap = typeof componentMap;

export default defineComponent({
    setup() {
        const comp = ref<ComponentMap[keyof ComponentMap] | null>(componentMap.element);

        /**
         * 更改显示的组件
         */
        function changeComp(val: keyof typeof componentMap | '') {
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

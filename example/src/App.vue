<template>
    <div>
        <button @click="changeComp('')">清空</button>
        <button @click="changeComp('select')">下拉框</button>
        <component :is="comp" />
    </div>
</template>

<script lang="ts">
import { defineComponent, markRaw, ref } from 'vue-demi';
import HSelect from './components/select/index.vue';

const componentMap = {
    select: markRaw(HSelect),
};
export default defineComponent({
    components: {
        HSelect,
    },
    setup() {
        const comp = ref<typeof componentMap[keyof typeof componentMap] | null>(componentMap.select);
        /**
         * 更改显示的组件
         */
        function changeComp(val: keyof typeof componentMap) {
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
button + button {
    margin-left: 10px;
}
</style>

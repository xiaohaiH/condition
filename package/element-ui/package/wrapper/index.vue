<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api -->
    <CoreWrapper ref="conditionRef" v-bind="$props" :size="size" v-on="$listeners">
        <template #default="{ t, labelSuffix: _labelSuffix, ...options }">
            <component :is="getComp(t)" :labelSuffix="_labelSuffix || labelSuffix" v-bind="options"></component>
        </template>
        <template #btn="option">
            <slot name="btn" v-bind="option">
                <template v-if="renderBtn">
                    <ElButton :size="size" @click="option.search">{{ searchText }}</ElButton>
                    <ElButton :size="size" @click="option[resetTriggerSearch ? 'resetAndSearch' : 'reset']()">
                        {{ resetText }}
                    </ElButton>
                </template>
            </slot>
        </template>
    </CoreWrapper>
</template>

<script lang="ts">
import { defineComponent, markRaw, PropType, ref } from 'vue-demi';
import { Button as ElButton } from 'element-ui';
import { CoreWrapper } from '@xiaohaih/condition-core';
import HSelect from '../select/index.vue';
import HInput from '../input/index.vue';
import HDatepicker from '../datepicker/index.vue';
import HCascader from '../cascader/index.vue';
import HRadio from '../radio/index.vue';
import { wrapperProps } from '../../src/common/props';
import { wrapperEmits } from '../../src/common/emits';

const compMap = {
    select: markRaw(HSelect),
    input: markRaw(HInput),
    datepicker: markRaw(HDatepicker),
    cascader: markRaw(HCascader),
    radio: markRaw(HRadio),
};
const userCompMap: Record<string, any> = {};

/**
 * 注册自定义组件
 * @param {string} name 类型
 * @param {} comp 可渲染的组件
 */
export function registerComponent(name: string, comp: any) {
    userCompMap[name] = markRaw(comp);
}

/**
 * 删除自定义组件
 * @param {string} name 定义的类型
 */
export function unregisterComponent(name: string) {
    delete userCompMap[name];
}

/**
 * @file 条件容器
 */
export default defineComponent({
    name: 'HWrapper',
    // inheritAttrs: false,
    components: {
        CoreWrapper,
        ElButton,
    },
    props: wrapperProps,
    emits: wrapperEmits,
    setup(props, context) {
        const conditionRef = ref<InstanceType<typeof CoreWrapper> | undefined>();
        /** 重置数据 */
        function reset() {
            conditionRef.value?.reset();
        }

        /**
         * 渲染组件
         * @param {string} t 组件类型
         */
        function getComp(t: string) {
            return userCompMap[t] || compMap[t as keyof typeof compMap] || null;
        }
        return {
            conditionRef,
            reset,
            getComp,
        };
    },
});
</script>

<style></style>

<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api -->
    <CoreWrapper v-bind="$attrs" :size="size" v-on="$listeners">
        <template #default="{ t, ...options }">
            <component :is="getComp(t)" v-bind="options"></component>
        </template>
        <template #btn="option">
            <slot name="btn" v-bind="option">
                <template v-if="renderBtn">
                    <ElButton :size="size" @click="option.search">搜索</ElButton>
                    <ElButton :size="size" @click="option.reset">重置</ElButton>
                </template>
            </slot>
        </template>
    </CoreWrapper>
</template>

<script lang="ts">
import { defineComponent, markRaw, PropType } from 'vue-demi';
import { Button as ElButton } from 'element-ui';
import { CoreWrapper } from 'core-condition';
import HSelect from '../select/index.vue';
import HInput from '../input/index.vue';
import HDatepicker from '../datepicker/index.vue';
import HCascader from '../cascader/index.vue';
import { HCondition } from '../../interface';
import { wrapperProps } from 'core-condition/common/props';
import { ElementUIComponentSize } from 'element-ui/types/component';

const compMap = {
    select: markRaw(HSelect),
    input: markRaw(HInput),
    datepicker: markRaw(HDatepicker),
    cascader: markRaw(HCascader),
};
const userCompMap: Record<string, any> = {};

/**
 * 注册自定义组件
 * @param {string} name 类型
 * @param {} comp 可渲染的组件
 */
export function registerComponent(name: string, comp: any) {
    userCompMap[name] = comp;
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
export default defineComponent<HCondition.WrapperProps>({
    // export default defineComponent<typeof wrapperProps>({
    inheritAttrs: false,
    props: {
        /** 是否渲染按钮 */
        renderBtn: { type: Boolean as PropType<boolean>, default: true },
        /** 组件大小 */
        size: { type: String as PropType<ElementUIComponentSize> },
    },
    components: {
        CoreWrapper,
        ElButton,
    },
    setup() {
        /**
         * option
         */
        function getComp(t: string) {
            return userCompMap[t] || compMap[t as keyof typeof compMap] || null;
        }
        return {
            getComp,
        };
    },
});
</script>

<style></style>

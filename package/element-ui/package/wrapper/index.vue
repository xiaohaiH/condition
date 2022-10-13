<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api -->
    <CoreWrapper v-bind="$attrs" v-on="$listeners">
        <template #default="{ t, ...options }">
            <component :is="getComp(t)" @search="options.compSearch" v-bind="options"></component>
        </template>
        <template #btn="option">
            <slot name="btn" v-bind="option">
                <template v-if="renderBtn">
                    <ElButton @click="option.search">搜索</ElButton>
                    <ElButton @click="option.reset">重置</ElButton>
                </template>
            </slot>
        </template>
    </CoreWrapper>
</template>

<script lang="ts">
import { defineComponent, markRaw, PropType } from 'vue-demi';
import { Button as ElButton } from 'element-ui';
import { CoreWrapper } from 'core';
import HSelect from '../select/index.vue';

const compMap = {
    select: markRaw(HSelect),
};

/**
 * 注册自定义组件
 * @param {string} name 类型
 * @param {} comp 可渲染的组件
 */
export function registerComponent(name: string, comp: any) {
    // @ts-ignore
    compMap[name] = comp;
}

/**
 * 删除自定义组件
 * @param {string} name 定义的类型
 */
export function unregisterComponent(name: string) {
    // @ts-ignore
    delete compMap[name];
}

/**
 * @file 条件容器
 */
export default defineComponent({
    inheritAttrs: false,
    props: {
        /** 是否渲染按钮 */
        renderBtn: { type: Boolean as PropType<boolean>, default: true },
    },
    components: {
        CoreWrapper,
        ElButton,
    },
    setup() {
        /**
         * option
         */
        function getComp(t: any) {
            return compMap[t as keyof typeof compMap] || null;
        }
        return {
            getComp,
        };
    },
});
</script>

<style></style>

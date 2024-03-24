<template>
    <ElForm v-bind="rootProps" v-on="$listeners" ref="formRef" :model="query">
        <template v-for="(item, key) of datum">
            <component
                :is="getComponent(item.t)"
                :key="key"
                v-bind="item"
                :field="item.as || key"
                :resetToInitialValue="resetToInitialValue"
                :backfill="backfill"
                :query="query"
            />
        </template>
        <slot name="btn" :search="search" :reset="reset" :resetAndSearch="resetAndSearch">
            <template v-if="renderBtn">
                <ElButton :size="size" @click="search">{{ searchText }}</ElButton>
                <ElButton :size="size" @click="resetTriggerSearch ? resetAndSearch() : reset()">
                    {{ resetText }}
                </ElButton>
            </template>
        </slot>
    </ElForm>
</template>

<script lang="ts">
import { computed, defineComponent, markRaw, onMounted, PropType, ref } from 'vue-demi';
import { Form as ElForm, Button as ElButton } from 'element-ui';
import { useWrapper } from '@xiaohaih/condition-core';
import HSelect from '../select/index.vue';
import HInput from '../input/index.vue';
import HDatepicker from '../datepicker/index.vue';
import HCascader from '../cascader/index.vue';
import HRadio from '../radio/index.vue';
import HCheckbox from '../checkbox/index.vue';
import { pick } from 'lodash-es';
import { wrapperProps as props, wrapperEmits as emits, formPropKeys } from './props';

const compMap = {
    select: markRaw(HSelect),
    input: markRaw(HInput),
    datepicker: markRaw(HDatepicker),
    cascader: markRaw(HCascader),
    radio: markRaw(HRadio),
    checkbox: markRaw(HCheckbox),
};
const userCompMap: Record<string, any> = {};

/** 默认定义组件的类型 */
export type ComponentType = (typeof compMap)[keyof typeof compMap];

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
 * 获取指定组件
 * @param {string} name? 组件类型
 */
export function getComponent(): Record<string, ComponentType>;
export function getComponent(name: string): ComponentType | undefined;
export function getComponent(name?: string) {
    return name ? userCompMap[name] || compMap[name as keyof typeof compMap] : { ...compMap, ...userCompMap };
}

/**
 * @file 条件容器
 */
export default defineComponent({
    name: 'HWrapper',
    inheritAttrs: false,
    components: {
        ElForm,
        ElButton,
    },
    props,
    emits,
    setup(props, context) {
        const rootProps = computed(() => pick(props, formPropKeys));
        const formRef = ref<InstanceType<typeof ElForm>>();
        // @ts-expect-error bind重载错误
        const search = context.emit.bind(context, 'search');
        // // @ts-expect-error bind重载错误
        const reset = context.emit.bind(context, 'reset');
        const wrapper = useWrapper({ ...props, search, reset });
        function resetAndSearch() {
            wrapper.reset();
            wrapper.search();
        }

        onMounted(() => {
            props.immediateSearch && context.emit('ready', wrapper.getQuery());
        });

        return {
            ...wrapper,
            rootProps,
            formRef,
            getComponent,
            resetAndSearch,
        };
    },
});
</script>

<style></style>

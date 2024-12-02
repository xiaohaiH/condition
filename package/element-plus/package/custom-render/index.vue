<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--custom condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
        v-bind.prop="formDynamicFields?.({ query })"
    >
        <slot
            :checked="checked"
            :option="finalOption"
            :disabled="insetDisabled"
            :hide="insetHide"
            :wrapper="wrapper"
            :updateCheckedValue="updateCheckedValue"
            :change="change"
            :reset="reset"
        >
            <component :is="customRender" />
        </slot>
    </ElFormItem>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { ElFormItem } from 'element-plus';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { customRenderProps as props } from './props';
import { formItemPropKeys } from '../share';

/**
 * @file 自定义渲染
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HCustomRender',
    components: {
        ElFormItem,
    },
    props,
    setup(props, ctx) {
        const plain = usePlain(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const customRender = props.render(plain);

        return {
            ...plain,
            formItemProps,
            customRender,
        };
    },
});
</script>

<style lang="css" scoped></style>

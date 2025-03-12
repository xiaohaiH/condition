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
import { getNode, usePlain } from '@xiaohaih/condition-core';
import { ElFormItem } from 'element-plus';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { customRenderProps as props } from './props';

/**
 * @file 自定义渲染
 */
export default defineComponent({
    name: 'HCustomRender',
    components: {
        ElFormItem,
    },
    inheritAttrs: false,
    props,
    setup(props, ctx) {
        const plain = usePlain(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const customRender = props.render({ ...plain, props });

        return {
            ...plain,
            formItemProps,
            customRender,
        };
    },
});
</script>

<style lang="css" scoped></style>

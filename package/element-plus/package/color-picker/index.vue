<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--color-picker condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElColorPicker
            v-bind="contentProps"
            :disabled="insetDisabled"
            :model-value="(checked as string)"
            class="condition-item__content"
            @change="(change as () => void)"
        ></ElColorPicker>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
            <template v-else>
                <component :is="getNode(postfix, checked)"></component>
            </template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { ElFormItem, ElColorPicker } from 'element-plus';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { colorPickerProps as props } from './props';
import { formItemPropKeys } from '../share';

const contentPropsKeys = Object.keys(ElColorPicker.props);

/**
 * @file 颜色选择器
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HColorPicker',
    components: {
        ElFormItem,
        ElColorPicker,
    },
    props,
    setup(props, ctx) {
        const plain = usePlain(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const contentProps = computed(() => pick(props, contentPropsKeys));

        return {
            ...plain,
            formItemProps,
            contentProps,
            getNode,
        };
    },
});
</script>

<style lang="css" scoped></style>

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
            :value="checked"
            class="condition-item__content"
            v-on="$listeners"
            @change="change"
        />
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">
                {{ postfix }}
            </template>
            <template v-else>
                <component :is="getNode(postfix, checked)" />
            </template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, usePlain } from '@xiaohaih/condition-core';
import { ColorPicker as ElColorPicker, FormItem as ElFormItem } from 'element-ui';
import { computed, defineComponent, ref } from 'vue-demi';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { colorPickerProps as props } from './props';

// @ts-expect-error UI.props报错
const contentPropsKeys = Object.keys(ElColorPicker.props);

/**
 * @file 颜色选择器
 */
export default defineComponent({
    name: 'HColorPicker',
    components: {
        ElFormItem,
        ElColorPicker,
    },
    inheritAttrs: false,
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

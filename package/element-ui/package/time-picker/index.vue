<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--time-picker ${
            isMultiple && 'condition-item--time-picker-range'
        } condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElTimePicker
            v-bind="contentProps"
            :disabled="insetDisabled"
            :value="checked"
            class="condition-item__content"
            @input="change"
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
import { FormItem as ElFormItem, TimePicker as ElTimePicker } from 'element-ui';
import { computed, defineComponent, reactive, toRefs } from 'vue-demi';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { timepickerProps as props } from './props';

// @ts-expect-error UI.props报错
const contentPropsKeys = Object.keys(ElTimePicker.props);

/**
 * @file 时间选择器
 */
export default defineComponent({
    name: 'HTimePicker',
    components: {
        ElFormItem,
        ElTimePicker,
    },
    inheritAttrs: false,
    props,
    setup(props, ctx) {
        const { multiple, fields, ..._props } = toRefs(props);
        const isMultiple = computed(() =>
            // @ts-ignore
            props.multiple !== undefined ? props.multiple : props.isRange,
        );
        const insetFields = computed(
            () =>
                props.fields
                || (isMultiple.value && props.beginField && props.endField
                    ? [props.beginField, props.endField]
                    : undefined),
        );
        const plain = usePlain(reactive({ ..._props, multiple: isMultiple, fields: insetFields }));
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const contentProps = computed(() => pick(props, contentPropsKeys));

        return {
            ...plain,
            formItemProps,
            contentProps,
            isMultiple,
            getNode,
        };
    },
});
</script>

<style lang="css" scoped></style>

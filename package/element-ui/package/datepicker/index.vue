<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--datepicker ${
            isMultiple && 'condition-item--datepicker-range'
        } condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElDatePicker
            v-bind="contentProps"
            v-on="$listeners"
            :disabled="insetDisabled"
            :value="checked"
            class="condition-item__content"
            @input="change"
        ></ElDatePicker>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
            <template v-else><component :is="getNode(postfix, checked)"></component></template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue-demi';
import { FormItem as ElFormItem, DatePicker as ElDatePicker } from 'element-ui';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { datepickerProps as props, elDatepickerProps } from './props';
import { formItemPropKeys } from '../share';

const reg = /range$/;
function isRange(str: string | undefined) {
    return str ? reg.test(str) : false;
}
const { defaultValue, ...surplusProps } = elDatepickerProps;
const contentPropsKeys = Object.keys(surplusProps);

/**
 * @file 日期选择
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HDatepicker',
    components: {
        ElFormItem,
        ElDatePicker,
    },
    props,
    setup(props, ctx) {
        const { multiple, fields, ..._props } = toRefs(props);
        const isMultiple = computed(() =>
            // @ts-ignore
            props.multiple !== undefined ? props.multiple : isRange(props.type as string),
        );
        const insetFields = computed(
            () =>
                props.fields ||
                (isMultiple.value && props.beginField && props.endField
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

<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--time-picker ${
            isMultiple && 'condition-item--time-picker-range'
        } condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
        v-bind.prop="formDynamicFields?.({ query })"
    >
        <template v-if="slotBefore || $slots.before">
            <component :is="getNode(slotBefore!, slotProps)" v-if="slotBefore" />
            <slot v-else name="before" v-bind="slotProps" />
        </template>
        <template v-if="slotDefault">
            <component :is="getNode(slotDefault, slotProps)" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElTimePicker
                v-bind="(contentProps as any)"
                :disabled="insetDisabled"
                :model-value="(checked as string)"
                class="condition-item__content"
                v-bind.prop="dynamicFields?.({ query })"
                @update:model-value="change"
            />
        </slot>
        <template v-if="slotAfter || $slots.after">
            <component :is="getNode(slotAfter!, slotProps)" v-if="slotAfter" />
            <slot v-else name="after" v-bind="slotProps" />
        </template>
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
import { ElFormItem, ElTimePicker } from 'element-plus';
import { computed, defineComponent, reactive, toRefs } from 'vue';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { timepickerProps as props } from './props';

const { label, defaultValue, ...p } = ElTimePicker.props;
const contentPropsKeys = Object.keys(p);

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
        const slotProps = computed(() => ({
            ...contentProps.value,
            'disabled': plain.insetDisabled.value,
            'modelValue': plain.checked.value,
            'onUpdate:modelValue': plain.change,
            'extraOption': {
                query: props.query,
                search: plain.wrapper!.search,
                insetSearch: plain.wrapper!.insetSearch,
            },
        }));

        return {
            ...plain,
            formItemProps,
            contentProps,
            isMultiple,
            getNode,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>

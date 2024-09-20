<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--radio condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
        v-bind.prop="formDynamicFields?.({ query })"
    >
        <template v-if="slotBefore || $slots.before">
            <component v-if="slotBefore" :is="getNode(slotBefore!, slotProps)"></component>
            <slot v-else name="before" v-bind="slotProps"></slot>
        </template>
        <template v-if="slotDefault">
            <component :is="getNode(slotDefault, slotProps)" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElRadioGroup
                ref="radioGroupRef"
                v-bind="contentProps"
                :disabled="insetDisabled"
                :model-value="(checked as any)"
                class="condition-item__content"
                @update:modelValue="(change as () => void)"
                v-bind.prop="dynamicFields?.({ query })"
            >
                <template v-for="item of finalOption" :key="item[valueKey]">
                    <component
                        :is="radioType"
                        :label="item[valueKey]"
                        :value="item[valueKey]"
                        :disabled="item[disabledKey]"
                        :border="border"
                        v-on:[eventName].prevent="customChange(item[valueKey], checked as string, change)"
                    >
                        {{ item[labelKey] }}
                    </component>
                </template>
            </ElRadioGroup>
        </slot>
        <template v-if="slotAfter || $slots.after">
            <component v-if="slotAfter" :is="getNode(slotAfter!, slotProps)"></component>
            <slot v-else name="after" v-bind="slotProps"></slot>
        </template>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
            <template v-else><component :is="getNode(postfix, checked)"></component></template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { ElFormItem, ElRadioGroup, ElRadioButton, ElRadio } from 'element-plus';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { radioProps as props } from './props';
import { formItemPropKeys } from '../share';

const { label, ...p } = ElRadioGroup.props;
const contentPropsKeys = Object.keys(p);

/**
 * @file 单选框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HRadio',
    components: {
        ElFormItem,
        ElRadioGroup,
        ElRadioButton,
        ElRadio,
    },
    props,
    setup(props, context) {
        const plain = usePlain(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const contentProps = computed(() => pick(props, contentPropsKeys));

        const radioGroupRef = ref<InstanceType<typeof ElRadioGroup> | undefined>();
        const radioType = computed(() => (props.type === 'button' ? 'ElRadioButton' : 'ElRadio'));

        const eventName = computed(() => (props.cancelable ? 'click' : null));
        /**
         * 单选框选中事件
         * @param {string} newVal 最新选中值
         * @param {string} currentVal 当前值
         * @param {Function} cb 值更改的回调
         */
        function customChange(newVal: string, currentVal: string, cb: (value: string | string[]) => void) {
            cb(newVal === currentVal ? '' : newVal);
        }
        const slotProps = computed(() => ({
            ...contentProps.value,
            disabled: plain.insetDisabled.value,
            modelValue: plain.checked.value,
            source: plain.finalOption.value,
            cancelableHandle: customChange,
            'onUpdate:modelValue': plain.change,
            class: 'condition-item__content',
            extraOption: {
                query: props.query,
                search: plain.wrapper!.search,
                insetSearch: plain.wrapper!.insetSearch,
            },
        }));

        return {
            ...plain,
            formItemProps,
            contentProps,
            radioGroupRef,
            radioType,
            eventName,
            customChange,
            getNode,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>

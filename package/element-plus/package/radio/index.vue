<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--radio condition-item--${field} condition-item--${!!postfix}`"
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
            <ElRadioGroup
                ref="radioGroupRef"
                v-bind="contentProps"
                :disabled="insetDisabled"
                :model-value="(checked as any)"
                class="condition-item__content"
                v-bind.prop="dynamicFields?.({ query })"
                @update:model-value="(change as () => void)"
            >
                <template v-for="item of finalOption" :key="item[valueKey]">
                    <component
                        :is="radioType"
                        :label="item[valueKey]"
                        :value="item[valueKey]"
                        :disabled="item[disabledKey]"
                        :border="border"
                        @[eventName].prevent="customChange(item[valueKey], checked as string, change)"
                    >
                        {{ item[labelKey] }}
                    </component>
                </template>
            </ElRadioGroup>
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
import { ElFormItem, ElRadio, ElRadioButton, ElRadioGroup } from 'element-plus';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { radioProps as props } from './props';

const { label, ...p } = ElRadioGroup.props;
const contentPropsKeys = Object.keys(p);

/**
 * @file 单选框
 */
export default defineComponent({
    name: 'HRadio',
    components: {
        ElFormItem,
        ElRadioGroup,
        ElRadioButton,
        ElRadio,
    },
    inheritAttrs: false,
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
            'disabled': plain.insetDisabled.value,
            'modelValue': plain.checked.value,
            'source': plain.finalOption.value,
            'cancelableHandle': customChange,
            'onUpdate:modelValue': plain.change,
            'class': 'condition-item__content',
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

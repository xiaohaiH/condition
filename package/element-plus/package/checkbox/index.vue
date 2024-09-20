<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--checkbox condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
        v-bind.prop="formDynamicFields?.({ query })"
    >
        <template v-if="slotBefore || $slots.before">
            <component v-if="slotBefore" :is="getNode(slotBefore!, slotProps)"></component>
            <slot v-else name="before"></slot>
        </template>
        <template v-if="slotDefault">
            <component :is="getNode(slotDefault, slotProps)" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElCheckboxGroup
                v-bind="contentProps"
                :disabled="insetDisabled"
                :model-value="(checked as string[])"
                ref="checkboxGroupRef"
                class="condition-item__content"
                @update:modelValue="(change as () => void)"
                v-bind.prop="dynamicFields?.({ query })"
            >
                <template v-for="item of finalOption" :key="item[valueKey]">
                    <component
                        :is="checkboxType"
                        :aria-label="item[labelKey]"
                        :value="item[valueKey]"
                        :true-value="trueValue"
                        :false-value="falseValue"
                        :border="border"
                        :disabled="item[disabledKey]"
                    >
                        {{ item[labelKey] }}
                    </component>
                </template>
            </ElCheckboxGroup>
        </slot>
        <template v-if="slotAfter || $slots.after">
            <component v-if="slotAfter" :is="getNode(slotAfter!, slotProps)"></component>
            <slot v-else name="after"></slot>
        </template>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
            <template v-else>
                <component :is="getNode(postfix, checked)"></component>
            </template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { ElFormItem, ElCheckboxGroup, ElCheckboxButton, ElCheckbox } from 'element-plus';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { checkboxProps as props } from './props';
import { formItemPropKeys } from '../share';

const { label, ...p } = ElCheckbox.props;
const contentPropsKeys = Object.keys(p);

/**
 * @file 复选框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HCheckbox',
    components: {
        ElFormItem,
        ElCheckboxGroup,
        ElCheckboxButton,
        ElCheckbox,
    },
    props,
    setup(props, context) {
        const checkboxGroupRef = ref<InstanceType<typeof ElCheckboxGroup> | undefined>();
        const checkboxType = computed(() => (props.type === 'button' ? 'ElCheckboxButton' : 'ElCheckbox'));
        const plain = usePlain(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const contentProps = computed(() => pick(props, contentPropsKeys));
        const slotProps = computed(() => ({
            ...contentProps.value,
            disabled: plain.insetDisabled.value,
            modelValue: plain.checked.value,
            'onUpdate:modelValue': plain.change,
            source: plain.finalOption.value,
            checkboxType: checkboxType.value,
            valueKey: props.valueKey,
            labelKey: props.labelKey,
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
            checkboxGroupRef,
            checkboxType,
            getNode,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>

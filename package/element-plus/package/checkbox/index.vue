<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--checkbox condition-item--${field} condition-item--${!!postfix}`"
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
            <ElCheckboxGroup
                v-bind="contentProps"
                ref="checkboxGroupRef"
                :disabled="insetDisabled"
                :model-value="(checked as string[])"
                class="condition-item__content"
                v-bind.prop="dynamicFields?.({ query })"
                @update:model-value="(change as () => void)"
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
import { ElCheckbox, ElCheckboxButton, ElCheckboxGroup, ElFormItem } from 'element-plus';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { checkboxProps as props } from './props';

const { label, ...p } = ElCheckbox.props;
const contentPropsKeys = Object.keys(p);

/**
 * @file 复选框
 */
export default defineComponent({
    name: 'HCheckbox',
    components: {
        ElFormItem,
        ElCheckboxGroup,
        ElCheckboxButton,
        ElCheckbox,
    },
    inheritAttrs: false,
    props,
    setup(props, context) {
        const checkboxGroupRef = ref<InstanceType<typeof ElCheckboxGroup> | undefined>();
        const checkboxType = computed(() => (props.type === 'button' ? 'ElCheckboxButton' : 'ElCheckbox'));
        const plain = usePlain(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const contentProps = computed(() => pick(props, contentPropsKeys));
        const slotProps = computed(() => ({
            ...contentProps.value,
            'disabled': plain.insetDisabled.value,
            'modelValue': plain.checked.value,
            'onUpdate:modelValue': plain.change,
            'source': plain.finalOption.value,
            'checkboxType': checkboxType.value,
            'valueKey': props.valueKey,
            'labelKey': props.labelKey,
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
            checkboxGroupRef,
            checkboxType,
            getNode,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>

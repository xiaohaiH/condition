<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--checkbox condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElCheckboxGroup
            v-bind="contentProps"
            :disabled="insetDisabled"
            :model-value="(checked as string[])"
            ref="checkboxGroupRef"
            class="condition-item__content"
            @update:modelValue="(change as () => void)"
        >
            <template v-for="item of finalOption" :key="item[valueKey]">
                <component :is="checkboxType" :aria-label="item[labelKey]" :value="item[valueKey]">
                    {{ item[labelKey] }}
                </component>
            </template>
        </ElCheckboxGroup>
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

        return {
            ...plain,
            formItemProps,
            contentProps,
            checkboxGroupRef,
            checkboxType,
            getNode,
        };
    },
});
</script>

<style lang="css" scoped></style>

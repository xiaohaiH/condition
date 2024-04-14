<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--checkbox condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElCheckboxGroup
            ref="checkboxGroupRef"
            v-bind="contentProps"
            v-on="$listeners"
            :disabled="insetDisabled"
            :value="checked"
            class="condition-item__content"
            @input="change"
        >
            <template v-for="item of finalOption">
                <component :is="checkboxType" :key="item[valueKey]" :label="item[valueKey]">
                    {{ item[labelKey] }}
                </component>
            </template>
        </ElCheckboxGroup>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
            <template v-else><component :is="getNode(postfix, checked)"></component></template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue-demi';
import {
    FormItem as ElFormItem,
    CheckboxGroup as ElCheckboxGroup,
    CheckboxButton as ElCheckboxButton,
    Checkbox as ElCheckbox,
} from 'element-ui';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { checkboxProps as props, elCheckboxProps } from './props';
import { formItemPropKeys } from '../share';

const contentPropsKeys = Object.keys(elCheckboxProps);

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
        const checkboxGroupRef = ref<ElCheckboxGroup | undefined>();
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

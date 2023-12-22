<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-unused-vars -->
    <CorePlain v-bind="$props" :multiple="true">
        <template #default="{ labelKey, valueKey, options, listeners, change, ...surplusProps }">
            <div
                :class="`condition-item condition-item--checkbox condition-item--${field} condition-item--${!!postfix}`"
            >
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElCheckboxGroup
                    ref="checkboxGroupRef"
                    v-bind="surplusProps"
                    class="condition-item__content"
                    @update:modelValue="change"
                >
                    <template v-for="item of options" :key="item[valueKey]">
                        <component :is="checkboxType" :label="item[valueKey]">{{ item[labelKey] }}</component>
                    </template>
                </ElCheckboxGroup>
                <div v-if="postfix" class="condition-item__postfix">
                    <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
                    <template v-else><component :is="getNode(postfix, surplusProps.modelValue)"></component></template>
                </div>
            </div>
        </template>
    </CorePlain>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { CorePlain } from '@xiaohaih/condition-core';
import { ElCheckboxGroup, ElCheckboxButton, ElCheckbox } from 'element-plus';
import { checkboxProps } from '../../src/common/props';
import { getNode } from '@xiaohaih/condition-core/utils/assist';

/**
 * @file 复选框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HCheckbox',
    components: {
        CorePlain,
        ElCheckboxGroup,
        ElCheckboxButton,
        ElCheckbox,
    },
    props: checkboxProps,
    setup(props, context) {
        const checkboxGroupRef = ref<InstanceType<typeof ElCheckboxGroup> | undefined>();
        const checkboxType = computed(() => (props.type === 'button' ? 'ElCheckboxButton' : 'ElCheckbox'));

        return { checkboxGroupRef, checkboxType, getNode };
    },
});
</script>

<style lang="css" scoped></style>

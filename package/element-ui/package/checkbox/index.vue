<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <CorePlain v-bind="$props" v-on="$listeners">
        <template #default="{ labelKey, valueKey, options, listeners, change, value, ...surplusProps }">
            <div
                :class="`condition-item condition-item--checkbox condition-item--${field} condition-item--${!!postfix}`"
            >
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElCheckboxGroup
                    ref="checkboxGroupRef"
                    :value="value || []"
                    v-bind="surplusProps"
                    v-on="listeners"
                    class="condition-item__content"
                    @input="change"
                >
                    <template v-for="item of options">
                        <component :is="checkboxType" :key="item[valueKey]" :label="item[valueKey]">
                            {{ item[labelKey] }}
                        </component>
                    </template>
                </ElCheckboxGroup>
                <div v-if="postfix" class="condition-item__postfix">
                    <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
                    <template v-else><component :is="getNode(postfix, value)"></component></template>
                </div>
            </div>
        </template>
    </CorePlain>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue-demi';
import { CorePlain } from '@xiaohaih/condition-core';
import {
    CheckboxGroup as ElCheckboxGroup,
    CheckboxButton as ElCheckboxButton,
    Checkbox as ElCheckbox,
} from 'element-ui';
import { checkboxProps } from '../../src/common/props';
import { getNode } from '@xiaohaih/condition-core/utils/assist';

/**
 * @file 复选框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HRadio',
    components: {
        CorePlain,
        ElCheckboxGroup,
        ElCheckboxButton,
        ElCheckbox,
    },
    props: checkboxProps,
    setup(props, context) {
        const checkboxGroupRef = ref<ElCheckboxGroup | undefined>();
        const checkboxType = computed(() => (props.type === 'button' ? 'ElCheckboxButton' : 'ElCheckbox'));

        return { checkboxGroupRef, checkboxType, getNode };
    },
});
</script>

<style lang="css" scoped></style>

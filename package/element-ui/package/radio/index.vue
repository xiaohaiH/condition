<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <CoreSelect v-bind="$props" v-on="$listeners">
        <template #default="{ labelKey, valueKey, options, listeners, change, ...surplusProps }">
            <div :class="`condition-item condition-item--radio condition-item--${field}`">
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElRadioGroup v-bind="surplusProps" v-on="listeners" class="condition-item__content" @input="change">
                    <template v-for="item of options">
                        <component :is="radioType" :key="item[valueKey]" :label="item[valueKey]">
                            {{ item[labelKey] }}
                        </component>
                    </template>
                </ElRadioGroup>
            </div>
        </template>
    </CoreSelect>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue-demi';
import { CoreSelect } from '@xiaohaih/condition-core';
import { RadioGroup as ElRadioGroup, RadioButton as ElRadioButton, Radio as ElRadio } from 'element-ui';
import { radioProps } from '../../src/common/props';

/**
 * @file 单选框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HRadio',
    components: {
        CoreSelect,
        ElRadioGroup,
        ElRadioButton,
        ElRadio,
    },
    props: radioProps,
    setup(props, context) {
        const radioType = computed(() => (props.type === 'button' ? 'ElRadioButton' : 'ElRadio'));

        return { radioType };
    },
});
</script>

<style lang="css" scoped></style>

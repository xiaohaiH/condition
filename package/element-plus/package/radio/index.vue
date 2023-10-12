<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-unused-vars -->
    <CoreSelect v-bind="$props">
        <template #default="{ labelKey, valueKey, options, listeners, change, ...surplusProps }">
            <div :class="`condition-item condition-item--radio condition-item--${field}`">
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElRadioGroup v-bind="surplusProps" class="condition-item__content" @update:modelValue="change">
                    <template v-for="item of options" :key="item[valueKey]">
                        <component :is="radioType" :label="item[valueKey]">
                            {{ item[labelKey] }}
                        </component>
                    </template>
                </ElRadioGroup>
            </div>
        </template>
    </CoreSelect>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { CoreSelect } from '@xiaohaih/condition-core';
import { ElRadioGroup, ElRadioButton, ElRadio } from 'element-plus';
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

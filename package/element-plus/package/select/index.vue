<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-unused-vars -->
    <CoreSelect v-bind="$props">
        <template
            #default="{ labelKey, valueKey, options, listeners, blur, change, label, labelSuffix, ...surplusProps }"
        >
            <div :class="`condition-item condition-item--select condition-item--${field}`">
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElSelect
                    :filterable="filterable"
                    :clearable="clearable"
                    v-bind="surplusProps"
                    class="condition-item__content"
                    @blur="blur"
                    @update:modelValue="change"
                >
                    <template v-for="item of options" :key="item[valueKey]">
                        <ElOption :label="item[labelKey]" :value="item[valueKey]"></ElOption>
                    </template>
                </ElSelect>
            </div>
        </template>
    </CoreSelect>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CoreSelect } from '@xiaohaih/condition-core';
import { ElSelect, ElOption } from 'element-plus';
import { selectProps } from '../../src/common/props';

/**
 * @file 下拉框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HSelect',
    components: {
        CoreSelect,
        ElSelect,
        ElOption,
    },
    props: selectProps,
});
</script>

<style lang="css" scoped></style>

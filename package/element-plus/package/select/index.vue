<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-unused-vars -->
    <CoreSelect v-bind="$props">
        <template #default="{ labelKey, valueKey, options, listeners, blur, change, ...surplusProps }">
            <ElSelect
                :filterable="filterable"
                :clearable="clearable"
                v-bind="surplusProps"
                @blur="blur"
                @update:modelValue="change"
            >
                <template v-for="item of options" :key="item[valueKey]">
                    <ElOption :label="item[labelKey]" :value="item[valueKey]"></ElOption>
                </template>
            </ElSelect>
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

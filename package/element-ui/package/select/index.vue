<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <CoreSelect v-bind="$attrs" v-on="$listeners">
        <template #default="{ labelKey, valueKey, options, listeners, blur, change, ...surplusProps }">
            <ElSelect
                :filterable="filterable"
                :clearable="clearable"
                v-bind="surplusProps"
                v-on="listeners"
                @blur="blur"
                @input="change"
            >
                <template v-for="item of options">
                    <ElOption :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]"></ElOption>
                </template>
            </ElSelect>
        </template>
    </CoreSelect>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { CoreSelect } from '@xiaohaih/condition-core';
import { Select as ElSelect, Option as ElOption } from 'element-ui';
import { selectProps } from '../../src/common/props';
import { selectProps as CoreSelectProps } from '@xiaohaih/condition-core/common/props';

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
    props: selectProps as typeof CoreSelectProps & typeof selectProps,
});
</script>

<style lang="css" scoped></style>

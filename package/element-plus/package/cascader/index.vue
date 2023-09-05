<template>
    <!-- eslint-disable vue/no-deprecated-v-on-native-modifier vue/no-unused-vars -->
    <CoreCascader v-bind="$props">
        <template #default="{ listeners, change, ...surplusProps }">
            <ElCascader
                :filterable="filterable"
                :clearable="clearable"
                v-bind="surplusProps"
                @update:modelValue="change"
            ></ElCascader>
        </template>
    </CoreCascader>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CoreCascader } from '@xiaohaih/condition-core';
import { ElCascader } from 'element-plus';
import { cascaderProps } from '../../src/common/props';
import { cascaderProps as CoreCascaderProps } from '@xiaohaih/condition-core/common/props';

/**
 * @file 级联选择
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HCascader',
    components: {
        CoreCascader,
        ElCascader,
    },
    props: cascaderProps,
});
</script>

<style lang="css" scoped></style>

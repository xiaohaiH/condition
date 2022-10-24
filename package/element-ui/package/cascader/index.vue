<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-deprecated-v-on-native-modifier -->
    <CoreCascader v-bind="$attrs" v-on="$listeners">
        <template #default="{ listeners, change, ...surplusProps }">
            <ElCascader
                :filterable="filterable"
                :clearable="clearable"
                v-bind="surplusProps"
                v-on="listeners"
                @change="change"
            ></ElCascader>
        </template>
    </CoreCascader>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { CoreCascader } from '@xiaohaih/condition-core';
import { Cascader as ElCascader } from 'element-ui';
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
    props: cascaderProps as typeof CoreCascaderProps & typeof cascaderProps,
});
</script>

<style lang="css" scoped></style>

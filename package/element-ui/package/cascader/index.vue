<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-deprecated-v-on-native-modifier -->
    <CoreDatepicker v-bind="$attrs" v-on="$listeners">
        <template #default="{ change, ...surplusProps }">
            <ElCascader v-bind="surplusProps" @input="change"></ElCascader>
        </template>
    </CoreDatepicker>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { CoreDatepicker } from 'core';
import { Cascader as ElCascader } from 'element-ui';

/**
 * @file 级联选择
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HCascader',
    components: {
        CoreDatepicker,
        ElCascader,
    },
});
</script>

<style lang="css" scoped></style>

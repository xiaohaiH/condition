<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-deprecated-v-on-native-modifier vue/no-unused-vars -->
    <CoreDatepicker :range="range" v-bind="$attrs" v-on="$listeners">
        <template #default="{ listeners, updateCheckedValue, change, ...surplusProps }">
            <ElDatePicker :valueFormat="valueFormat" v-bind="surplusProps" @input="change"></ElDatePicker>
        </template>
    </CoreDatepicker>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { CoreDatepicker } from '@xiaohaih/condition-core';
import { DatePicker as ElDatePicker } from 'element-ui';
import { datepickerProps } from '../../src/common/props';
import { datepickerProps as CoreDatepickerProps } from '@xiaohaih/condition-core/common/props';

const reg = /range$/;
function isRange(str: string | undefined) {
    return str ? reg.test(str) : false;
}
/**
 * @file 日期选择
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HDatepicker',
    components: {
        CoreDatepicker,
        ElDatePicker,
    },
    props: datepickerProps as typeof CoreDatepickerProps & typeof datepickerProps,
    computed: {
        range(): boolean {
            return isRange(this.$attrs.type);
        },
    },
});
</script>

<style lang="css" scoped></style>

<template>
    <!-- eslint-disable vue/no-deprecated-v-on-native-modifier vue/no-unused-vars -->
    <CoreDatepicker :range="range" v-bind="$props">
        <template #default="{ listeners, updateCheckedValue, change, ...surplusProps }">
            <ElDatePicker :valueFormat="valueFormat" v-bind="surplusProps" @update:modelValue="change"></ElDatePicker>
        </template>
    </CoreDatepicker>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { CoreDatepicker } from '@xiaohaih/condition-core';
import { ElDatePicker } from 'element-plus';
import { datepickerProps } from '../../src/common/props';

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
    props: datepickerProps,
    setup(props, ctx) {
        // @ts-ignore
        const range = computed(() => isRange(props.type as string));

        return { range };
    },
});
</script>

<style lang="css" scoped></style>

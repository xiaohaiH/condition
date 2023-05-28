<template>
    <!-- eslint-disable vue/no-deprecated-v-on-native-modifier vue/no-unused-vars -->
    <CoreDatepicker :range="range" v-bind="$attrs">
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
    setup(props, ctx) {
        const range = computed(() => isRange(ctx.attrs.type as string));

        return { range };
    },
});
</script>

<style lang="css" scoped></style>

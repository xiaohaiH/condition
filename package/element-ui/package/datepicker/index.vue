<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-deprecated-v-on-native-modifier vue/no-unused-vars -->
    <CoreDatepicker :range="range" v-bind="$props" v-on="$listeners">
        <template #default="{ listeners, updateCheckedValue, change, ...surplusProps }">
            <div :class="`condition-item condition-item--datepicker condition-item--${field}`">
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElDatePicker
                    :valueFormat="valueFormat"
                    v-bind="surplusProps"
                    class="condition-item__content"
                    @input="change"
                ></ElDatePicker>
            </div>
        </template>
    </CoreDatepicker>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { CoreDatepicker } from '@xiaohaih/condition-core';
import { DatePicker as ElDatePicker } from 'element-ui';
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
    computed: {
        range(): boolean {
            // @ts-ignore
            return isRange(this.type);
        },
    },
});
</script>

<style lang="css" scoped></style>

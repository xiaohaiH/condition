<template>
    <!-- eslint-disable vue/no-deprecated-v-on-native-modifier vue/no-unused-vars -->
    <CoreDatepicker :range="range" v-bind="$props">
        <template #default="{ listeners, updateCheckedValue, change, label, labelSuffix, ...surplusProps }">
            <div :class="`condition-item condition-item--datepicker condition-item--${field}`">
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElDatePicker
                    :valueFormat="valueFormat"
                    v-bind="surplusProps"
                    class="condition-item__content"
                    @update:modelValue="change"
                ></ElDatePicker>
            </div>
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

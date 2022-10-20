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
import { CoreDatepicker } from 'core-condition';
import { DatePicker as ElDatePicker } from 'element-ui';

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
    props: {
        // 日期格式化的类型
        valueFormat: { type: String, default: 'yyyy-MM-dd' },
    },
    computed: {
        range(): boolean {
            return isRange(this.$attrs.type);
        },
    },
});
</script>

<style lang="css" scoped></style>

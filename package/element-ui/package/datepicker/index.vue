<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-deprecated-v-on-native-modifier -->
    <CoreDatepicker v-bind="$attrs" v-on="$listeners">
        <template #default="{ updateChecked, change, ...surplusProps }">
            <ElDatePicker v-bind="surplusProps" @input="updateChecked" @change="change"></ElDatePicker>
        </template>
    </CoreDatepicker>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { CoreDatepicker } from 'core';
import { DatePicker as ElDatePicker } from 'element-ui';

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
});
</script>

<style lang="css" scoped></style>

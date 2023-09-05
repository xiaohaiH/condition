<template>
    <!-- eslint-disable vue/no-deprecated-v-on-native-modifier vue/no-unused-vars -->
    <CoreInput v-bind="$props">
        <template #default="{ listeners, debounceChange, enterHandler, ...surplusProps }">
            <ElInput
                :clearable="clearable"
                v-bind="surplusProps"
                @input="debounceChange"
                @keydown.native.enter="enterHandler"
            ></ElInput>
        </template>
    </CoreInput>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CoreInput } from '@xiaohaih/condition-core';
import { ElInput } from 'element-plus';
import { inputProps } from '../../src/common/props';

/**
 * @file 输入框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HInput',
    components: {
        CoreInput,
        ElInput,
    },
    props: inputProps,
});
</script>

<style lang="css" scoped></style>

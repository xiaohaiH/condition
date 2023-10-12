<template>
    <!-- eslint-disable vue/no-deprecated-v-on-native-modifier vue/no-unused-vars -->
    <CoreInput v-bind="$props">
        <template #default="{ listeners, debounceChange, enterHandler, label, labelSuffix, ...surplusProps }">
            <div :class="`condition-item condition-item--cascader condition-item--${field}`">
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElInput
                    :clearable="clearable"
                    v-bind="surplusProps"
                    class="condition-item__content"
                    @input="debounceChange"
                    @keydown.native.enter="enterHandler"
                ></ElInput>
            </div>
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

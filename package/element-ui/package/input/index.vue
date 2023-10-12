<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-deprecated-v-on-native-modifier -->
    <CoreInput v-bind="$props" v-on="$listeners">
        <template #default="{ listeners, debounceChange, enterHandler, label, labelSuffix, ...surplusProps }">
            <div :class="`condition-item condition-item--input condition-item--${field}`">
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElInput
                    :clearable="clearable"
                    v-bind="surplusProps"
                    v-on="listeners"
                    class="condition-item__content"
                    @input="debounceChange"
                    @keydown.native.enter="enterHandler"
                ></ElInput>
            </div>
        </template>
    </CoreInput>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { CoreInput } from '@xiaohaih/condition-core';
import { Input as ElInput } from 'element-ui';
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

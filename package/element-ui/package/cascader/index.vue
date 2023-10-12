<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-deprecated-v-on-native-modifier -->
    <CoreCascader v-bind="$props" v-on="$listeners">
        <template #default="{ listeners, change, label, labelSuffix, ...surplusProps }">
            <div :class="`condition-item condition-item--cascader condition-item--${field}`">
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElCascader
                    :filterable="filterable"
                    :clearable="clearable"
                    v-bind="surplusProps"
                    v-on="listeners"
                    class="condition-item__content"
                    @change="change"
                ></ElCascader>
            </div>
        </template>
    </CoreCascader>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { CoreCascader } from '@xiaohaih/condition-core';
import { Cascader as ElCascader } from 'element-ui';
import { cascaderProps } from '../../src/common/props';

/**
 * @file 级联选择
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HCascader',
    components: {
        CoreCascader,
        ElCascader,
    },
    props: cascaderProps,
});
</script>

<style lang="css" scoped></style>

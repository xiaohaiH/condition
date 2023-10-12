<template>
    <!-- eslint-disable vue/no-deprecated-v-on-native-modifier vue/no-unused-vars -->
    <CoreCascader v-bind="$props">
        <template #default="{ listeners, change, label, labelSuffix, ...surplusProps }">
            <div :class="`condition-item condition-item--cascader condition-item--${field}`">
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElCascader
                    :filterable="filterable"
                    :clearable="clearable"
                    v-bind="surplusProps"
                    class="condition-item__content"
                    @update:modelValue="change"
                ></ElCascader>
            </div>
        </template>
    </CoreCascader>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CoreCascader } from '@xiaohaih/condition-core';
import { ElCascader } from 'element-plus';
import { cascaderProps } from '../../src/common/props';
import { cascaderProps as CoreCascaderProps } from '@xiaohaih/condition-core/common/props';

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

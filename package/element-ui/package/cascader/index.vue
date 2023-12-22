<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-deprecated-v-on-native-modifier -->
    <CoreTree v-bind="$props" v-on="$listeners">
        <template #default="{ listeners, change, label, labelSuffix, ...surplusProps }">
            <div
                :class="`condition-item condition-item--cascader condition-item--${field} condition-item--${!!postfix}`"
            >
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElCascader
                    :filterable="filterable"
                    :clearable="clearable"
                    v-bind="surplusProps"
                    v-on="listeners"
                    class="condition-item__content"
                    @change="change"
                ></ElCascader>
                <div v-if="postfix" class="condition-item__postfix">
                    <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
                    <template v-else><component :is="getNode(postfix, surplusProps.value)"></component></template>
                </div>
            </div>
        </template>
    </CoreTree>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { CoreTree } from '@xiaohaih/condition-core';
import { Cascader as ElCascader } from 'element-ui';
import { cascaderProps } from '../../src/common/props';
import { getNode } from '@xiaohaih/condition-core/utils/assist';

/**
 * @file 级联选择
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HCascader',
    components: {
        CoreTree,
        ElCascader,
    },
    props: cascaderProps,
    setup(props, ctx) {
        return { getNode };
    },
});
</script>

<style lang="css" scoped></style>

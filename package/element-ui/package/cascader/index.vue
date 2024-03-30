<template>
    <ElFormItem
        :class="`condition-item condition-item--cascader condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElCascader
            v-bind="cascaderProps"
            v-on="$listeners"
            :disabled="insetDisabled"
            :options="finalOption"
            :value="checked"
            class="condition-item__content"
            @change="change"
        ></ElCascader>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
            <template v-else><component :is="getNode(postfix, checked)"></component></template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue-demi';
import { FormItem as ElFormItem, Cascader as ElCascader } from 'element-ui';
import { pick } from 'lodash-es';
import { useTree, getNode } from '@xiaohaih/condition-core';
import { cascaderProps as props } from './props';
import { formItemPropKeys } from '../share';

// @ts-expect-error UI.props报错
const cascaderPropKeys = Object.keys(ElCascader.props);

/**
 * @file 级联选择
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HCascader',
    components: {
        ElFormItem,
        ElCascader,
    },
    props,
    setup(props, ctx) {
        const plain = useTree(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const cascaderProps = computed(() => pick(props, cascaderPropKeys));

        return {
            ...plain,
            formItemProps,
            cascaderProps,
            getNode,
        };
    },
});
</script>

<style lang="css" scoped></style>

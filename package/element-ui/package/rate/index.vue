<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--rate condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElRate
            v-bind="contentProps"
            :disabled="insetDisabled"
            :value="checked"
            class="condition-item__content"
            @change="change"
        ></ElRate>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
            <template v-else>
                <component :is="getNode(postfix, checked)"></component>
            </template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue-demi';
import { FormItem as ElFormItem, Rate as ElRate } from 'element-ui';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { rateProps as props } from './props';
import { formItemPropKeys } from '../share';

// @ts-expect-error UI.props报错
const contentPropsKeys = Object.keys(ElRate.props);

/**
 * @file 评分
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HRate',
    components: {
        ElFormItem,
        ElRate,
    },
    props,
    setup(props, ctx) {
        const plain = usePlain(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const contentProps = computed(() => pick(props, contentPropsKeys));

        return {
            ...plain,
            formItemProps,
            contentProps,
            getNode,
        };
    },
});
</script>

<style lang="css" scoped></style>

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
        />
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">
                {{ postfix }}
            </template>
            <template v-else>
                <component :is="getNode(postfix, checked)" />
            </template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, usePlain } from '@xiaohaih/condition-core';
import { FormItem as ElFormItem, Rate as ElRate } from 'element-ui';
import { computed, defineComponent, ref } from 'vue-demi';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { rateProps as props } from './props';

// @ts-expect-error UI.props报错
const contentPropsKeys = Object.keys(ElRate.props);

/**
 * @file 评分
 */
export default defineComponent({
    name: 'HRate',
    components: {
        ElFormItem,
        ElRate,
    },
    inheritAttrs: false,
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

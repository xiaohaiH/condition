<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--rate condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
        v-bind.prop="formDynamicFields?.({ query })"
    >
        <template v-if="slotBefore || $slots.before">
            <component v-if="slotBefore" :is="getNode(slotBefore!, slotProps)"></component>
            <slot v-else name="before"></slot>
        </template>
        <template v-if="slotDefault">
            <component :is="getNode(slotDefault, slotProps)" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElRate
                v-bind="contentProps"
                :disabled="insetDisabled"
                :model-value="(checked as number)"
                class="condition-item__content"
                @change="change"
                v-bind.prop="dynamicFields?.({ query })"
            ></ElRate>
        </slot>
        <template v-if="slotAfter || $slots.after">
            <component v-if="slotAfter" :is="getNode(slotAfter!, slotProps)"></component>
            <slot v-else name="after"></slot>
        </template>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
            <template v-else>
                <component :is="getNode(postfix, checked)"></component>
            </template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { ElFormItem, ElRate } from 'element-plus';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { rateProps as props } from './props';
import { formItemPropKeys } from '../share';

const { label, ...p } = ElRate.props;
const contentPropsKeys = Object.keys(p);

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
        const slotProps = computed(() => ({
            ...contentProps.value,
            disabled: plain.insetDisabled.value,
            modelValue: plain.checked.value,
            onChange: plain.change,
            class: 'condition-item__content',
            extraOption: {
                query: props.query,
                search: plain.wrapper!.search,
                insetSearch: plain.wrapper!.insetSearch,
            },
        }));

        return {
            ...plain,
            formItemProps,
            contentProps,
            getNode,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>

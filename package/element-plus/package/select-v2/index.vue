<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--select-v2 condition-item--${field} condition-item--${!!postfix}`"
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
            <ElSelectV2
                v-bind="contentProps"
                :disabled="insetDisabled"
                :model-value="checked"
                :options="filterSource"
                :filter-method="filterMethod && customFilterMethod"
                class="condition-item__content"
                @update:modelValue="change"
                v-bind.prop="dynamicFields?.({ query })"
            ></ElSelectV2>
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
import { computed, customRef, defineComponent, ref } from 'vue';
import { ElFormItem, ElSelectV2 } from 'element-plus';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { selectV2Props as props } from './props';
import { formItemPropKeys } from '../share';

const contentPropsKeys = Object.keys(ElSelectV2.props);

/**
 * @file 虚拟列表下拉框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HSelectV2',
    components: {
        ElFormItem,
        ElSelectV2,
    },
    props,
    setup(props, ctx) {
        const plain = usePlain(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const contentProps = computed(() => pick(props, contentPropsKeys));

        const filterValue = ref('');
        const customFilterMethod = (val: string) => {
            filterValue.value = val;
        };
        const filterSource = computed(() => {
            const val = filterValue.value;
            return val ? plain.finalOption.value.filter(props.filterMethod!.bind(null, val)) : plain.finalOption.value;
        });
        const slotProps = computed(() => ({
            ...contentProps.value,
            disabled: plain.insetDisabled.value,
            modelValue: plain.checked.value,
            options: filterSource.value,
            filterMethod: props.filterMethod && customFilterMethod,
            'onUpdate:modelValue': plain.change,
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
            filterValue,
            customFilterMethod,
            filterSource,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>

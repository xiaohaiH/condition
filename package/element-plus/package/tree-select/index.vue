<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--tree-select condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
        v-bind.prop="formDynamicFields?.({ query })"
    >
        <template v-if="slotBefore || $slots.before">
            <component v-if="slotBefore" :is="getNode(slotBefore!, slotProps)"></component>
            <slot v-else name="before" v-bind="slotProps"></slot>
        </template>
        <template v-if="slotDefault">
            <component :is="getNode(slotDefault, slotProps)" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElTreeSelect
                v-bind="contentProps"
                :disabled="insetDisabled"
                :data="filterSource"
                :model-value="(checked as string[])"
                :filter-method="filterMethod && customFilterMethod"
                class="condition-item__content"
                @update:modelValue="change"
                v-bind.prop="dynamicFields?.({ query })"
            ></ElTreeSelect>
        </slot>
        <template v-if="slotAfter || $slots.after">
            <component v-if="slotAfter" :is="getNode(slotAfter!, slotProps)"></component>
            <slot v-else name="after" v-bind="slotProps"></slot>
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
import { ElFormItem, ElTreeSelect } from 'element-plus';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { treeSelectProps as props } from './props';
import { formItemPropKeys } from '../share';

const contentPropsKeys = Object.keys(ElTreeSelect.props);

/**
 * @file 树形下拉框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HTreeSelect',
    components: {
        ElFormItem,
        ElTreeSelect,
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
            data: filterSource.value,
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

<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--tree-select condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElTreeSelect
            v-bind="contentProps"
            :disabled="insetDisabled"
            :data="filterSource"
            :model-value="(checked as string[])"
            :filter-method="filterMethod && customFilterMethod"
            class="condition-item__content"
            @update:modelValue="change"
        ></ElTreeSelect>
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

const contentPropKeys = Object.keys(ElTreeSelect.props);

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
        const contentProps = computed(() => pick(props, contentPropKeys));

        const filterValue = ref('');
        const customFilterMethod = (val: string) => {
            filterValue.value = val;
        };
        const filterSource = computed(() => {
            const val = filterValue.value;
            return val ? plain.finalOption.value.filter(props.filterMethod!.bind(null, val)) : plain.finalOption.value;
        });

        return {
            ...plain,
            formItemProps,
            contentProps,
            getNode,
            filterValue,
            customFilterMethod,
            filterSource,
        };
    },
});
</script>

<style lang="css" scoped></style>

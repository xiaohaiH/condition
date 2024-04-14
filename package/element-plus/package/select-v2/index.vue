<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--select-v2 condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElSelectV2
            v-bind="contentProps"
            :disabled="insetDisabled"
            :model-value="checked"
            :filter-method="filterMethod && customFilterMethod"
            class="condition-item__content"
            @update:modelValue="change"
        ></ElSelectV2>
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

const contentPropKeys = Object.keys(ElSelectV2.props);

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

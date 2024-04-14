<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--time-select condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElTimeSelect
            v-bind="contentProps"
            :disabled="insetDisabled"
            :model-value="(checked as string)"
            class="condition-item__content"
            @update:model-value="change"
        ></ElTimeSelect>
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
import { ElFormItem, ElTimeSelect } from 'element-plus';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { timeSelectProps as props } from './props';
import { formItemPropKeys } from '../share';

const contentPropKeys = Object.keys(ElTimeSelect.props);

/**
 * @file 时间选择
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HTimeSelect',
    components: {
        ElFormItem,
        ElTimeSelect,
    },
    props,
    setup(props, ctx) {
        const plain = usePlain(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const contentProps = computed(() => pick(props, contentPropKeys));

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

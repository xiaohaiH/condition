<template>
    <ElFormItem
        :class="`condition-item condition-item--radio condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElRadioGroup
            ref="radioGroupRef"
            v-bind="radioProps"
            :disabled="insetDisabled"
            :model-value="(checked as any)"
            class="condition-item__content"
            @update:modelValue="(change as () => void)"
        >
            <template v-for="item of finalOption" :key="item[valueKey]">
                <component
                    :is="radioType"
                    :label="item[valueKey]"
                    v-on:[eventName].prevent="customChange(item[valueKey], checked as string, change)"
                >
                    {{ item[labelKey] }}
                </component>
            </template>
        </ElRadioGroup>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
            <template v-else><component :is="getNode(postfix, checked)"></component></template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { ElFormItem, ElRadioGroup, ElRadioButton, ElRadio } from 'element-plus';
import { pick } from 'lodash-es';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { radioProps as props } from './props';
import { formItemPropKeys } from '../share';

const radioPropKeys = Object.keys(ElRadioGroup.props);

/**
 * @file 单选框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HRadio',
    components: {
        ElFormItem,
        ElRadioGroup,
        ElRadioButton,
        ElRadio,
    },
    props,
    setup(props, context) {
        const plain = usePlain(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const radioProps = computed(() => pick(props, radioPropKeys));

        const radioGroupRef = ref<InstanceType<typeof ElRadioGroup> | undefined>();
        const radioType = computed(() => (props.type === 'button' ? 'ElRadioButton' : 'ElRadio'));

        const eventName = computed(() => (props.cancelable ? 'click' : null));
        /**
         * 单选框选中事件
         * @param {string} newVal 最新选中值
         * @param {string} currentVal 当前值
         * @param {Function} cb 值更改的回调
         */
        function customChange(newVal: string, currentVal: string, cb: (value: string | string[]) => void) {
            cb(newVal === currentVal ? '' : newVal);
        }

        return {
            ...plain,
            formItemProps,
            radioProps,
            radioGroupRef,
            radioType,
            eventName,
            customChange,
            getNode,
        };
    },
});
</script>

<style lang="css" scoped></style>

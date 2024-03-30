<template>
    <ElFormItem
        :class="`condition-item condition-item--radio condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElRadioGroup
            ref="radioGroupRef"
            v-bind="radioProps"
            v-on="$listeners"
            :disabled="insetDisabled"
            :value="checked"
            class="condition-item__content"
            @input="change"
        >
            <template v-for="item of finalOption">
                <component
                    :is="radioType"
                    :key="item[valueKey]"
                    :label="item[valueKey]"
                    v-on:[eventName].native.prevent="customChange(item[valueKey], checked, change)"
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
import { defineComponent, computed, ref } from 'vue-demi';
import {
    FormItem as ElFormItem,
    RadioGroup as ElRadioGroup,
    RadioButton as ElRadioButton,
    Radio as ElRadio,
} from 'element-ui';
import { pick } from 'lodash-es';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { radioProps as props } from './props';
import { formItemPropKeys } from '../share';

// @ts-expect-error UI.props报错
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

        const radioGroupRef = ref<ElRadioGroup | undefined>();
        const radioType = computed(() => (props.type === 'button' ? 'ElRadioButton' : 'ElRadio'));

        const eventName = computed(() => (props.cancelable ? 'click' : null));
        /**
         * 单选框选中事件
         * @param {string} newVal 最新选中值
         * @param {string} currentVal 当前值
         * @param {Function} cb 值更改的回调
         */
        function customChange(newVal: string, currentVal: string, cb: (value?: string) => void) {
            cb(newVal === currentVal ? '' : newVal);
            radioGroupRef.value?.$children.forEach((o) => (o.$el as HTMLElement).blur());
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

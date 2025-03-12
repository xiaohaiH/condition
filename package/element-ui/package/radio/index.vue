<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--radio condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElRadioGroup
            ref="radioGroupRef"
            v-bind="contentProps"
            :disabled="insetDisabled"
            :value="checked"
            class="condition-item__content"
            v-on="$listeners"
            @input="change"
        >
            <template v-for="item of finalOption">
                <component
                    :is="radioType"
                    :key="item[valueKey]"
                    :label="item[valueKey]"
                    @[eventName].native.prevent="customChange(item[valueKey], checked, change)"
                >
                    {{ item[labelKey] }}
                </component>
            </template>
        </ElRadioGroup>
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
import {
    FormItem as ElFormItem,
    Radio as ElRadio,
    RadioButton as ElRadioButton,
    RadioGroup as ElRadioGroup,
} from 'element-ui';
import { computed, defineComponent, ref } from 'vue-demi';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { radioProps as props } from './props';

// @ts-expect-error UI.props报错
const contentPropsKeys = Object.keys(ElRadioGroup.props);

/**
 * @file 单选框
 */
export default defineComponent({
    name: 'HRadio',
    components: {
        ElFormItem,
        ElRadioGroup,
        ElRadioButton,
        ElRadio,
    },
    inheritAttrs: false,
    props,
    setup(props, context) {
        const plain = usePlain(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const contentProps = computed(() => pick(props, contentPropsKeys));

        const radioGroupRef = ref<ElRadioGroup | undefined>();
        const radioType = computed(() => (props.type === 'button' ? 'ElRadioButton' : 'ElRadio'));

        const eventName = computed(() => (props.cancelable ? 'click' : null));
        /**
         * 单选框选中事件
         * @param {string} newVal 最新选中值
         * @param {string} currentVal 当前值
         * @param {Function} cb 值更改的回调
         */
        function customChange(newVal: string, currentVal: string | string[], cb: (value: string | string[]) => void) {
            cb(newVal === currentVal ? '' : newVal);
            // @ts-ignore 忽视 VNode 的报错
            radioGroupRef.value?.$children.forEach((o) => (o.$el as HTMLElement).blur());
        }

        return {
            ...plain,
            formItemProps,
            contentProps,
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

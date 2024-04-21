<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--input-number condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <!-- 不监听回车事件, 防止实际值与组件内部的值(会根据提供的精度等配置项而主动改变)不匹配 -->
        <!-- @keydown.enter="enterHandle" -->
        <ElInputNumber
            v-bind="contentProps"
            :disabled="insetDisabled"
            :value="checked || null"
            class="condition-item__content"
            @input="debounceChange"
        ></ElInputNumber>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
            <template v-else>
                <component :is="getNode(postfix, checked)"></component>
            </template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue-demi';
import { FormItem as ElFormItem, InputNumber as ElInputNumber } from 'element-ui';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { inputNumberProps as props } from './props';
import { formItemPropKeys } from '../share';

// @ts-expect-error UI.props报错
const contentPropsKeys = Object.keys(ElInputNumber.props);

/**
 * @file 数字输入框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HInputNumber',
    components: {
        ElFormItem,
        ElInputNumber,
    },
    props,
    setup(props, ctx) {
        const plain = usePlain(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const contentProps = computed(() => pick(props, contentPropsKeys));

        /**
         * 节流
         * @param {number} value: 输入值
         */
        let timer = 0;
        function debounceChange(value: number | null | undefined) {
            const { realtime, waitTime } = props;
            timer && clearTimeout(timer);
            if (realtime) {
                plain.change(value);
            } else {
                plain.updateCheckedValue(value);
                if (!plain.wrapper) return;
                timer = setTimeout(plain.wrapper.insetSearch, waitTime) as unknown as number;
            }
        }
        /** 回车事件 */
        function enterHandle(ev: Event | KeyboardEvent) {
            timer && clearTimeout(timer);
            plain.checked.value = (ev.target as HTMLInputElement).value;
            plain.option.updateWrapperQuery();
            plain.wrapper?.search();
        }

        return {
            ...plain,
            formItemProps,
            contentProps,
            debounceChange,
            enterHandle,
            getNode,
        };
    },
});
</script>

<style lang="css" scoped></style>

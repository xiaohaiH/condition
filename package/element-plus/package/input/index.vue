<template>
    <ElFormItem
        :class="`condition-item condition-item--input condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElInput
            v-bind="inputProps"
            :disabled="insetDisabled"
            :model-value="(checked as string)"
            class="condition-item__content"
            @input="debounceChange"
            @keydown.enter="enterHandle"
        ></ElInput>
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
import { ElFormItem, ElInput } from 'element-plus';
import { pick } from 'lodash-es';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { inputProps as props } from './props';
import { formItemPropKeys } from '../share';

const inputPropKeys = Object.keys(ElInput.props);

/**
 * @file 输入框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HInput',
    components: {
        ElFormItem,
        ElInput,
    },
    props,
    setup(props, ctx) {
        const plain = usePlain(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const inputProps = computed(() => pick(props, inputPropKeys));

        /**
         * 节流
         * @param {string} value: 输入值
         */
        let timer = 0;
        function debounceChange(value: string) {
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
            inputProps,
            debounceChange,
            enterHandle,
            getNode,
        };
    },
});
</script>

<style lang="css" scoped></style>

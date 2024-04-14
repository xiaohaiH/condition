<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--input condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElInput
            v-on="$listeners"
            v-bind="contentProps"
            :disabled="insetDisabled"
            :value="checked"
            @input="debounceChange"
            @keydown.native.enter="enterHandle"
            class="condition-item__content"
        >
            <template v-if="slotPrefix || $slots.prefix" #prefix>
                <slot v-if="$slots.prefix" name="prefix"></slot>
                <component v-else :is="getNode(slotPrefix, { backfill, query, search, insideSearch })"></component>
            </template>
            <template v-if="slotSuffix || $slots.suffix" #suffix>
                <slot v-if="$slots.suffix" name="suffix"></slot>
                <component v-else :is="getNode(slotSuffix, { backfill, query, search, insideSearch })"></component>
            </template>
            <template v-if="slotPrepend || $slots.prepend" #prepend>
                <slot v-if="$slots.prepend" name="prepend"></slot>
                <component v-else :is="getNode(slotPrepend, { backfill, query, search, insideSearch })"></component>
            </template>
            <template v-if="slotAppend || $slots.append" #append>
                <slot v-if="$slots.append" name="append"></slot>
                <component v-else :is="getNode(slotAppend, { backfill, query, search, insideSearch })"></component>
            </template>
        </ElInput>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
            <template v-else><component :is="getNode(postfix, checked)"></component></template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { computed, defineComponent, markRaw, ref, VNode } from 'vue-demi';
import { FormItem as ElFormItem, Input as ElInput } from 'element-ui';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { inputProps as props, elInputInsetField } from './props';
import { formItemPropKeys } from '../share';

// @ts-expect-error UI.props报错
const contentPropsKeys = Object.keys(ElInput.props).concat(Object.keys(elInputInsetField));

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
        const contentProps = computed(() => pick(props, contentPropsKeys));

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
        /** 触发外部搜索事件 */
        function search() {
            plain.wrapper?.search();
        }
        /** 仅触发内部搜索事件 */
        function insideSearch() {
            plain.wrapper?.insetSearch();
        }

        return {
            ...plain,
            formItemProps,
            contentProps,
            debounceChange,
            enterHandle,
            search,
            insideSearch,
            getNode,
        };
    },
});
</script>

<style lang="css" scoped></style>

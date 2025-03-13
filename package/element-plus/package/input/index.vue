<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--input condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
        v-bind.prop="formDynamicFields?.({ query })"
    >
        <template v-if="slotBefore || $slots.before">
            <component :is="getNode(slotBefore!, slotProps)" v-if="slotBefore" />
            <slot v-else name="before" v-bind="slotProps" />
        </template>
        <template v-if="slotDefault">
            <component :is="getNode(slotDefault, slotProps)" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElInput
                v-bind="contentProps"
                :disabled="insetDisabled"
                :model-value="checked as string"
                class="condition-item__content"
                v-bind.prop="dynamicFields?.({ query })"
                @update:model-value="debounceChange"
                @keydown.enter="enterHandle"
            >
                <template v-if="slotPrefix || $slots.prefix" #prefix>
                    <slot v-if="$slots.prefix" name="prefix" />
                    <component :is="getNode(slotPrefix!, { backfill, query, search, insideSearch })" v-else />
                </template>
                <template v-if="slotSuffix || $slots.suffix" #suffix>
                    <slot v-if="$slots.suffix" name="suffix" />
                    <component :is="getNode(slotSuffix!, { backfill, query, search, insideSearch })" v-else />
                </template>
                <template v-if="slotPrepend || $slots.prepend" #prepend>
                    <slot v-if="$slots.prepend" name="prepend" />
                    <component :is="getNode(slotPrepend!, { backfill, query, search, insideSearch })" v-else />
                </template>
                <template v-if="slotAppend || $slots.append" #append>
                    <slot v-if="$slots.append" name="append" />
                    <component :is="getNode(slotAppend!, { backfill, query, search, insideSearch })" v-else />
                </template>
            </ElInput>
        </slot>
        <template v-if="slotAfter || $slots.after">
            <component :is="getNode(slotAfter!, slotProps)" v-if="slotAfter" />
            <slot v-else name="after" v-bind="slotProps" />
        </template>
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
import { ElFormItem, ElInput } from 'element-plus';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { inputProps as props } from './props';

const { label, ...p } = ElInput.props;
const contentPropsKeys = Object.keys(p);

/**
 * @file 输入框
 */
export default defineComponent({
    name: 'HInput',
    components: {
        ElFormItem,
        ElInput,
    },
    inheritAttrs: false,
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
        const slotProps = computed(() => ({
            ...contentProps.value,
            disabled: plain.insetDisabled.value,
            modelValue: plain.checked.value,
            'onUpdate:modelValue': debounceChange,
            'onKeydown.enter': enterHandle,
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
            debounceChange,
            enterHandle,
            search,
            insideSearch,
            getNode,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>

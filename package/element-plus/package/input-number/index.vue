<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--input-number condition-item--${field} condition-item--${!!postfix}`"
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
            <!-- 不监听回车事件, 防止实际值与组件内部的值(会根据提供的精度等配置项而主动改变)不匹配 -->
            <!-- @keydown.enter="enterHandle" -->
            <!-- :model-value="((checked ? Number(checked) : null) as number)" -->
            <ElInputNumber
                v-bind="contentProps"
                :disabled="insetDisabled"
                :model-value="checked === 0 ? 0 : (checked as number) || undefined"
                class="condition-item__content"
                v-bind.prop="dynamicFields?.({ query })"
                @update:model-value="debounceChange"
            >
                <template v-if="slotDecreaseIcon || $slots.decreaseIcon" #decrease-icon>
                    <slot v-if="$slots.decreaseIcon" name="decrease-icon" />
                    <component :is="slotDecreaseIcon!" v-else />
                </template>
                <template v-if="slotIncreaseIcon || $slots.increaseIcon" #increase-icon>
                    <slot v-if="$slots.increaseIcon" name="increase-icon" />
                    <component :is="slotIncreaseIcon!" v-else />
                </template>
            </ElInputNumber>
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
import { ElFormItem, ElInputNumber } from 'element-plus';
import { computed, defineComponent, ref } from 'vue';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { inputNumberProps as props } from './props';

const { label, ...p } = ElInputNumber.props;
const contentPropsKeys = Object.keys(p);

/**
 * @file 数字输入框
 */
export default defineComponent({
    name: 'HInputNumber',
    components: {
        ElFormItem,
        ElInputNumber,
    },
    inheritAttrs: false,
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
            }
            else {
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
        const slotProps = computed(() => ({
            ...contentProps.value,
            'disabled': plain.insetDisabled.value,
            'modelValue': plain.checked.value === 0 ? 0 : (plain.checked.value as number) || undefined,
            'onUpdate:modelValue': debounceChange,
            'class': 'condition-item__content',
            'extraOption': {
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
            getNode,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>

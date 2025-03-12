<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--cascader condition-item--${field} condition-item--${!!postfix}`"
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
            <ElCascader
                v-bind="contentProps"
                :props="customProps"
                :disabled="insetDisabled"
                :options="finalOption"
                :model-value="(checked as string[])"
                class="condition-item__content"
                v-bind.prop="dynamicFields?.({ query })"
                @update:model-value="insetChange"
            />
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
import { getNode, isEmptyValue, usePlain, useTree } from '@xiaohaih/condition-core';
import { ElCascader, ElFormItem } from 'element-plus';
import { computed, defineComponent, nextTick, reactive, toRefs } from 'vue';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { cascaderProps as props } from './props';

const contentPropsKeys = Object.keys(ElCascader.props);

/**
 * @file 级联选择
 */
export default defineComponent({
    name: 'HCascader',
    components: {
        ElFormItem,
        ElCascader,
    },
    inheritAttrs: false,
    props,
    setup(props, ctx) {
        const { multiple: a, ...args } = toRefs(props);
        const emitPath = computed(() =>
            props.props?.multiple || props.props?.emitPath !== undefined
                ? props.props?.emitPath
                : (props.fields && props.fields?.length > 1) || false,
        );
        const multiple = computed(() => props.props?.multiple || emitPath.value);
        const customProps = computed(() => {
            const r = { ...props.props, emitPath: emitPath.value };
            if (r.emitPath === undefined) delete r.emitPath;
            return r;
        });
        const plain = usePlain(reactive({ ...args, multiple }));
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const contentProps = computed(() => pick(props, contentPropsKeys));
        const slotProps = computed(() => ({
            ...contentProps.value,
            'props': customProps.value,
            'disabled': plain.insetDisabled.value,
            'options': plain.finalOption.value,
            'modelValue': plain.checked.value,
            'onUpdate:modelValue': insetChange,
            'class': 'condition-item__content',
            'extraOption': {
                query: props.query,
                search: plain.wrapper!.search,
                insetSearch: plain.wrapper!.insetSearch,
            },
        }));
        /**
         * 重写 change 事件
         * 防止存在默认值时, element-plus 组件清空值时
         * 内部马上重写会导致值更新了, ui 未更新
         */
        function insetChange(val: any) {
            if (!isEmptyValue(props.defaultValue) && isEmptyValue(val)) {
                plain.checked.value = undefined;
                nextTick(() => plain.change(props.defaultValue));
            }
            else {
                plain.change(val);
            }
        }

        return {
            ...plain,
            formItemProps,
            contentProps,
            customProps,
            getNode,
            slotProps,
            insetChange,
        };
    },
});
</script>

<style lang="css" scoped></style>

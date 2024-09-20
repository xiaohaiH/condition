<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--cascader condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
        v-bind.prop="formDynamicFields?.({ query })"
    >
        <template v-if="slotBefore || $slots.before">
            <component v-if="slotBefore" :is="getNode(slotBefore!, slotProps)"></component>
            <slot v-else name="before"></slot>
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
                @update:modelValue="(change as () => void)"
                v-bind.prop="dynamicFields?.({ query })"
            ></ElCascader>
        </slot>
        <template v-if="slotAfter || $slots.after">
            <component v-if="slotAfter" :is="getNode(slotAfter!, slotProps)"></component>
            <slot v-else name="after"></slot>
        </template>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
            <template v-else>
                <component :is="getNode(postfix, checked)"></component>
            </template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, toRefs } from 'vue';
import { ElFormItem, ElCascader } from 'element-plus';
import { pick } from '../../utils';
import { useTree, getNode, usePlain } from '@xiaohaih/condition-core';
import { cascaderProps as props } from './props';
import { formItemPropKeys } from '../share';

const contentPropsKeys = Object.keys(ElCascader.props);

/**
 * @file 级联选择
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HCascader',
    components: {
        ElFormItem,
        ElCascader,
    },
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
            props: customProps.value,
            disabled: plain.insetDisabled.value,
            options: plain.finalOption.value,
            modelValue: plain.checked.value,
            'onUpdate:modelValue': plain.change,
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
            customProps,
            getNode,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>

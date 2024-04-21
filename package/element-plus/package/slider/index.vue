<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--slider condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElSlider
            v-bind="contentProps"
            :disabled="insetDisabled"
            :model-value="(checked as number)"
            class="condition-item__content"
            @update:model-value="(change as () => void)"
        ></ElSlider>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
            <template v-else>
                <component :is="getNode(postfix, checked)"></component>
            </template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, reactive } from 'vue';
import { ElFormItem, ElSlider } from 'element-plus';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { sliderProps as props } from './props';
import { formItemPropKeys } from '../share';

const contentPropsKeys = Object.keys(ElSlider.props);

/**
 * @file 滑块
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HSlider',
    components: {
        ElFormItem,
        ElSlider,
    },
    props,
    setup(props, ctx) {
        const { range, defaultValue, ...args } = toRefs(props);
        const _props = reactive({ ...args, multiple: range });
        // @ts-expect-error 缺少默认值字段
        range.value && !defaultValue.value && (_props.defaultValue = [0, 0] as any);
        const plain = usePlain(_props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const contentProps = computed(() => pick(props, contentPropsKeys));

        return {
            ...plain,
            formItemProps,
            contentProps,
            getNode,
        };
    },
});
</script>

<style lang="css" scoped></style>

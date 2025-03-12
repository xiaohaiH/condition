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
            :value="checked"
            class="condition-item__content"
            @input="change"
        />
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
import { FormItem as ElFormItem, Slider as ElSlider } from 'element-ui';
import { computed, defineComponent, reactive, ref, toRefs } from 'vue-demi';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { sliderProps as props } from './props';

// @ts-expect-error UI.props报错
const contentPropsKeys = Object.keys(ElSlider.props);

/**
 * @file 滑块
 */
export default defineComponent({
    name: 'HSlider',
    components: {
        ElFormItem,
        ElSlider,
    },
    inheritAttrs: false,
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

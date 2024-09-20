<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--upload condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
        v-bind.prop="formDynamicFields?.({ query })"
    >
        <template v-if="slotBefore || $slots.before">
            <component v-if="slotBefore" :is="getNode(slotBefore!, slotProps)"></component>
            <slot v-else name="before" v-bind="slotProps"></slot>
        </template>
        <template v-if="slotDefault">
            <component :is="getNode(slotDefault, slotProps)" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElUpload
                ref="uploadRef"
                v-bind="contentProps"
                :disabled="insetDisabled"
                :file-list="(checked as any[])"
                class="condition-item__content"
                @update:file-list="customChange"
                v-bind.prop="dynamicFields?.({ query })"
            >
                <template v-if="slotDefault || $slots.default" #default>
                    <slot v-if="$slots.default" name="default"></slot>
                    <component v-else :is="getNode(slotDefault, { backfill, query, uploadRef })"></component>
                </template>
                <template v-if="slotTrigger || $slots.trigger" #trigger>
                    <slot v-if="$slots.trigger" name="trigger"></slot>
                    <component v-else :is="getNode(slotTrigger, { backfill, query, uploadRef })"></component>
                </template>
                <template v-if="slotTip || $slots.tip" #tip>
                    <slot v-if="$slots.tip" name="tip"></slot>
                    <component v-else :is="getNode(slotTip, { backfill, query, uploadRef })"></component>
                </template>
                <template v-if="slotFile || $slots.file" #file="{ file }">
                    <slot v-if="$slots.file" name="file"></slot>
                    <component v-else :is="getNode(slotFile, { backfill, query, uploadRef, file })"></component>
                </template>
            </ElUpload>
        </slot>
        <template v-if="slotAfter || $slots.after">
            <component v-if="slotAfter" :is="getNode(slotAfter!, slotProps)"></component>
            <slot v-else name="after" v-bind="slotProps"></slot>
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
import { computed, defineComponent, ref, onMounted } from 'vue';
import { ElFormItem, ElUpload, UploadFile, UploadUserFile } from 'element-plus';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { uploadProps as props } from './props';
import { formItemPropKeys } from '../share';

const contentPropsKeys = Object.keys(ElUpload.props);

/**
 * @file 上传组件
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HUpload',
    components: {
        ElFormItem,
        ElUpload,
    },
    props,
    setup(props, ctx) {
        const uploadRef = ref<InstanceType<typeof ElUpload>>();
        const _props = computed(() => ({ ...props, multiple: true }));
        const plain = usePlain(_props.value);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const contentProps = computed(() => pick(props, contentPropsKeys));
        function customChange(fileList: any[]) {
            plain.change(fileList as any[]);
        }
        props.getUploadInstance && onMounted(() => uploadRef.value && props.getUploadInstance!(uploadRef.value));
        const slotProps = computed(() => ({
            ...contentProps.value,
            disabled: plain.insetDisabled.value,
            fileList: plain.checked.value,
            'onUpdate:fileList': customChange,
            class: 'condition-item__content',
            extraOption: {
                query: props.query,
                search: plain.wrapper!.search,
                insetSearch: plain.wrapper!.insetSearch,
            },
        }));

        return {
            uploadRef,
            ...plain,
            formItemProps,
            contentProps,
            getNode,
            customChange,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>

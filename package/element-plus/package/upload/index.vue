<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--upload condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElUpload
            ref="uploadRef"
            v-bind="contentProps"
            :disabled="insetDisabled"
            class="condition-item__content"
            :file-list="(checked as any[])"
            @update:file-list="customChange"
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

const contentPropKeys = Object.keys(ElUpload.props);

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
        const contentProps = computed(() => pick(props, contentPropKeys));
        function customChange(fileList: any[]) {
            plain.change(fileList as any[]);
        }
        props.getUploadInstance && onMounted(() => uploadRef.value && props.getUploadInstance!(uploadRef.value));

        return {
            uploadRef,
            ...plain,
            formItemProps,
            contentProps,
            getNode,
            customChange,
        };
    },
});
</script>

<style lang="css" scoped></style>

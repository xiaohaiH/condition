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
            :file-list="checked"
            @update:file-list="customChange"
        >
            <template v-if="slotDefault || $slots.default" #default>
                <slot v-if="$slots.default" name="default" />
                <component :is="getNode(slotDefault, { backfill, query })" v-else />
            </template>
            <template v-if="slotTrigger || $slots.trigger" #trigger>
                <slot v-if="$slots.trigger" name="trigger" />
                <component :is="getNode(slotTrigger, { backfill, query })" v-else />
            </template>
            <template v-if="slotTip || $slots.tip" #tip>
                <slot v-if="$slots.tip" name="tip" />
                <component :is="getNode(slotTip, { backfill, query })" v-else />
            </template>
            <template v-if="slotFile || $slots.file" #file>
                <slot v-if="$slots.file" name="file" />
                <component :is="getNode(slotFile, { backfill, query })" v-else />
            </template>
        </ElUpload>
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
import { FormItem as ElFormItem, Upload as ElUpload } from 'element-ui';
import type { ElUploadInternalFileDetail as UploadFile } from 'element-ui/types/upload.d';
import { computed, defineComponent, onMounted, ref } from 'vue-demi';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { uploadProps as props } from './props';

// @ts-expect-error UI.props报错
const contentPropsKeys = Object.keys(ElUpload.props);

/**
 * @file 上传组件
 */
export default defineComponent({
    name: 'HUpload',
    components: {
        ElFormItem,
        ElUpload,
    },
    inheritAttrs: false,
    props,
    setup(props, ctx) {
        const uploadRef = ref<InstanceType<typeof ElUpload>>();
        const _props = computed(() => ({ ...props, multiple: true }));
        const plain = usePlain(_props.value);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const contentProps = computed(() => pick(props, contentPropsKeys));
        function customChange(fileList: UploadFile[]) {
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

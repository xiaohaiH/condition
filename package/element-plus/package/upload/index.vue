<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--upload condition-item--${field} condition-item--${!!postfix}`"
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
            <ElUpload
                ref="uploadRef"
                v-bind="contentProps"
                :disabled="insetDisabled"
                :file-list="(checked as any[])"
                class="condition-item__content"
                :before-upload="finalBeforeUpload"
                :httpRequest="(finalHttpRequest as any)"
                :onExceed="handleExceed"
                v-bind.prop="dynamicFields?.({ query })"
                @update:file-list="change"
            >
                <template #default>
                    <slot v-if="$slots.default" name="default" />
                    <component
                        :is="getNode(slotDefault, { backfill, query, uploadRef })"
                        v-else-if="slotDefault"
                    />
                    <template v-else>
                        <ElButton>{{ buttonText }}</ElButton>
                    </template>
                </template>
                <template v-if="slotTrigger || $slots.trigger" #trigger>
                    <slot v-if="$slots.trigger" name="trigger" />
                    <component :is="getNode(slotTrigger, { backfill, query, uploadRef })" v-else />
                </template>
                <template v-if="slotTip || $slots.tip" #tip>
                    <slot v-if="$slots.tip" name="tip" />
                    <component :is="getNode(slotTip, { backfill, query, uploadRef })" v-else />
                </template>
                <template v-if="slotFile || $slots.file" #file="{ file }">
                    <slot v-if="$slots.file" name="file" />
                    <component :is="getNode(slotFile, { backfill, query, uploadRef, file })" v-else />
                </template>
            </ElUpload>
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
import { ElButton, ElFormItem, ElUpload, genFileId } from 'element-plus';
import type { UploadFile, UploadRawFile, UploadRequestOptions, UploadUserFile } from 'element-plus';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { uploadProps as props } from './props';

const { httpRequest, onExceed, ...args } = ElUpload.props;
const contentPropsKeys = Object.keys(args);

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
        const finalHttpRequest = computed(() => props.httpRequest && customHttpRequest);
        /** 防止 promise 结果和 option.回调都执行时, 结果会执行两次 */
        function customHttpRequest(option: UploadRequestOptions) {
            let isFinish = false;
            const _option = { ...option, onSuccess, onError };
            function onSuccess(...args: Parameters<UploadRequestOptions['onSuccess']>) {
                if (isFinish) return;
                isFinish = true;
                option.onSuccess.apply(option, args);
            }
            function onError(...args: Parameters<UploadRequestOptions['onError']>) {
                if (isFinish) return;
                isFinish = true;
                option.onError.apply(option, args);
            }

            const r = props.httpRequest!(_option);
            if (r instanceof Promise) r.then(onSuccess).catch(onError);
            else return r;
        }
        function handleExceed(files: File[], uploadFiles: UploadUserFile[]) {
            // @ts-expect-error 忽视参数未声明的报错
            if (props.limit !== 1) return props.onExceed?.(files, uploadFiles);
            const file = files[0] as UploadRawFile;
            if (props.fileMaxSize && file.size > props.fileMaxSize) { return props.fileMaxSizeToast(file, props.fileMaxSize); }
            const r = uploadFiles.find((v) => v.raw && v.raw.name === file.name && v.raw.type === file.type);
            if (r) return props.fileRepeatToast(r.raw!);
            uploadRef.value!.clearFiles();
            file.uid = genFileId();
            uploadRef.value!.handleStart(file);
            // @ts-expect-error 忽视参数未声明的报错
            props.autoUpload && uploadRef.value!.submit();
        }
        function finalBeforeUpload(rawFile: UploadRawFile) {
            if (props.beforeUpload) return props.beforeUpload(rawFile);
            if (props.fileMaxSize && rawFile.size > props.fileMaxSize) {
                props.fileMaxSizeToast(rawFile, props.fileMaxSize);
                return false;
            }
            const _checked = (plain.checked.value || []) as UploadFile[];
            if (!_checked.length) return;
            const r = _checked.find((v) => v.name === rawFile.name && v.raw?.type === rawFile.type);
            if (r) {
                props.fileRepeatToast(r.raw!);
                return false;
            }
        }

        const slotProps = computed(() => ({
            ...contentProps.value,
            'disabled': plain.insetDisabled.value,
            'fileList': plain.checked.value,
            'onUpdate:fileList': plain.change,
            'class': 'condition-item__content',
            'extraOption': {
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
            finalHttpRequest,
            finalBeforeUpload,
            handleExceed,
            getNode,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>

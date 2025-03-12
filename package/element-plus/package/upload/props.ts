import { plainProps } from '@xiaohaih/condition-core';
import { ElMessage, ElUpload } from 'element-plus';
import type { ElUpload as ElUploadType, UploadFile, UploadHooks, UploadRequestOptions } from 'element-plus';
import type { PropType, VNode } from 'vue';
import { commonProps, formItemProps } from '../share';

// ElUploadType 不重命名导入, 打包的时候报推断类型过深
type UploadInstance = InstanceType<typeof ElUploadType>;

interface Query {
    backfill: Record<string, any>;
    query: Record<string, any>;
    uploadRef?: UploadInstance;
}

export const uploadProps = {
    ...(ElUpload.props as {}),
    // ...emits2Props(ElUpload.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    /** 重声明该字段并做优化, 内部处理 success 和 promise 结果只执行一次 */
    httpRequest: {
        type: Function as PropType<(option: UploadRequestOptions) => Promise<unknown> | XMLHttpRequest | void>,
    },
    beforeUpload: { type: Function as PropType<UploadHooks['beforeUpload']> },
    /** 上传按钮显示的文字 */
    buttonText: { type: String, default: '上传图片' },
    /** 上传文件的最大大小 */
    fileMaxSize: { type: Number },
    /** 超过限制的文件大小时的提示语 */
    fileMaxSizeToast: {
        type: Function as PropType<(file: File, size: number) => void>,
        default: (file: File, size: number) =>
            ElMessage.error(`上传文件(${file.name})大小不能超过${~~((size / 1024 / 1024) * 100) / 100}M`),
    },
    /** 上传相同文件时的提示语 */
    fileRepeatToast: {
        type: Function as PropType<(file: File) => void>,
        default: (file: File) => ElMessage.error(`不能重复上传文件(${file.name})`),
    },
    /** 是否开启覆盖上传 - 当 limit 为 1 时生效 */
    override: { type: Boolean as PropType<boolean> },
    /** 上传组件内置插槽 */
    slotDefault: { type: [Object, Function] as PropType<VNode | ((option: Query) => VNode)> },
    slotTrigger: { type: [Object, Function] as PropType<VNode | ((option: Query) => VNode)> },
    slotTip: { type: [Object, Function] as PropType<VNode | ((option: Query) => VNode)> },
    slotFile: { type: [Object, Function] as PropType<VNode | ((option: Query & { file: UploadFile }) => VNode)> },
} as const;

import { plainProps } from '@xiaohaih/condition-core';
import { Upload as ElUpload } from 'element-ui';
import type { ElUploadInternalFileDetail } from 'element-ui/types/upload.d';
import type { PropType, VNode } from 'vue';
import { commonProps, formItemProps } from '../share';

interface Query {
    backfill: Record<string, any>;
    query: Record<string, any>;
}

export const uploadProps = {
    // @ts-expect-error UI.props报错
    ...(ElUpload.props as {}),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    /** 外部需要获取 el-upload 实例时传递 */
    getUploadInstance: { type: Function as PropType<(ins: InstanceType<typeof ElUpload>) => void> },
    /** 上传组件内置插槽 */
    slotDefault: { type: [Object, Function] as PropType<VNode | ((option: Query) => VNode)> },
    slotTrigger: { type: [Object, Function] as PropType<VNode | ((option: Query) => VNode)> },
    slotTip: { type: [Object, Function] as PropType<VNode | ((option: Query) => VNode)> },
    slotFile: {
        type: [Object, Function] as PropType<VNode | ((option: Query & { file: ElUploadInternalFileDetail }) => VNode)>,
    },
} as const;

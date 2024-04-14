import { PropType, VNode } from 'vue';
import { ElUpload, UploadFile } from 'element-plus';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

type Query = {
    backfill: Record<string, any>;
    query: Record<string, any>;
};

export const uploadProps = {
    ...(ElUpload.props as {}),
    // ...emits2Props(ElUpload.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    /** 外部需要获取 el-upload 实例时传递 */
    getUploadInstance: { type: Function as PropType<(ins: InstanceType<typeof ElUpload>) => void> },
    /** 上传组件内置插槽 */
    slotDefault: { type: [Object, Function] as PropType<VNode | ((option: Query) => VNode)> },
    slotTrigger: { type: [Object, Function] as PropType<VNode | ((option: Query) => VNode)> },
    slotTip: { type: [Object, Function] as PropType<VNode | ((option: Query) => VNode)> },
    slotFile: { type: [Object, Function] as PropType<VNode | ((option: Query & { file: UploadFile }) => VNode)> },
} as const;

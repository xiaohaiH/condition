import { PropType } from 'vue';
import { ElInput } from 'element-plus';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const inputProps = {
    ...(ElInput.props as {}),
    // ...emits2Props(ElInput.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    /** 实时触发时做抖动, 防止频繁触发 */
    realtime: { type: Boolean as PropType<boolean>, default: false },
    /** 实时触发时防抖动的时间 */
    waitTime: { type: Number as PropType<number>, default: 300 },
    clearable: { type: Boolean as PropType<boolean>, default: true },
} as const;

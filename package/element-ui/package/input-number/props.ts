import { PropType, VNode } from 'vue';
import { InputNumber as ElInputNumber } from 'element-ui';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const inputNumberProps = {
    // @ts-expect-error UI.props报错
    ...(ElInputNumber.props as {}),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    /** 是否实时触发搜索事件(当 wrapper.realtime 为 true 时, 可将该值设为 false 并设置抖动时间) */
    realtime: { type: Boolean as PropType<boolean>, default: true },
    /** 实时触发时防抖动的时间 */
    waitTime: { type: Number as PropType<number>, default: 300 },
} as const;

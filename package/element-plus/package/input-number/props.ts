import { PropType, VNode } from 'vue';
import { ElInputNumber } from 'element-plus';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const inputNumberProps = {
    ...(ElInputNumber.props as {}),
    // ...emits2Props(ElInputNumber.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    /** 增加图标 slots.increase-icon */
    slotIncreaseIcon: { type: Object as PropType<VNode> },
    /** 减少图标 slots.decrease-icon */
    slotDecreaseIcon: { type: Object as PropType<VNode> },
    /** 是否实时触发搜索事件(当 wrapper.realtime 为 true 时, 可将该值设为 false 并设置抖动时间) */
    realtime: { type: Boolean as PropType<boolean>, default: true },
    /** 实时触发时防抖动的时间 */
    waitTime: { type: Number as PropType<number>, default: 300 },
} as const;

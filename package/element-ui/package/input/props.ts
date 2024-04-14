import type { PropType, VNode } from 'vue-demi';
import { Input as ElInput } from 'element-ui';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

type Query = {
    backfill: Record<string, any>;
    query: Record<string, any>;
    /** 触发外部搜索事件 */
    search(): void;
    /** 触发内部搜索事件 */
    insideSearch(): void;
};

/** el-input 未列出的字段 */
export const elInputInsetField = {
    maxlength: { type: [String, Number, Boolean] },
    minlength: { type: [String, Number, Boolean] },
    placeholder: { type: [String, Number, Boolean] },
    rows: { type: [String, Number, Boolean] },
    name: { type: [String, Number, Boolean] },
    max: { type: [String, Number, Boolean] },
    min: { type: [String, Number, Boolean] },
    step: { type: [String, Number, Boolean] },
    autofocus: { type: [String, Number, Boolean] },
};

export const inputProps = {
    // @ts-expect-error UI.props报错
    ...(ElInput.props as {}),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    ...elInputInsetField,
    /** 输入框头部内容 slots.prefix */
    slotPrefix: { type: [Object, Function] as PropType<VNode | ((option: Query) => VNode)> },
    /** 输入框尾部内容 slots.suffix */
    slotSuffix: { type: [Object, Function] as PropType<VNode | ((option: Query) => VNode)> },
    /** 输入框前置内容 slots.prepend */
    slotPrepend: { type: [Object, Function] as PropType<VNode | ((option: Query) => VNode)> },
    /** 输入框后置内容 slots.append */
    slotAppend: { type: [Object, Function] as PropType<VNode | ((option: Query) => VNode)> },
    /** 是否实时触发搜索事件(当 wrapper.realtime 为 true 时, 可将该值设为 false 并设置抖动时间) */
    realtime: { type: Boolean as PropType<boolean>, default: true },
    /** 实时触发时防抖动的时间 */
    waitTime: { type: Number as PropType<number>, default: 300 },
    clearable: { type: Boolean as PropType<boolean>, default: true },
} as const;

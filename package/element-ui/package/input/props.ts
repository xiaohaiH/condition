import type { PropType } from 'vue-demi';
import { Input as ElInput } from 'element-ui';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

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
    /** 实时触发时做抖动, 防止频繁触发 */
    realtime: { type: Boolean as PropType<boolean>, default: false },
    /** 实时触发时防抖动的时间 */
    waitTime: { type: Number as PropType<number>, default: 300 },
    clearable: { type: Boolean as PropType<boolean>, default: true },
} as const;

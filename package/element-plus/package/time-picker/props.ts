import { plainProps } from '@xiaohaih/condition-core';
import { ElTimePicker } from 'element-plus';
import type { PropType } from 'vue';
import { commonProps, formItemProps } from '../share';

// @ts-expect-error UI.props报错
const { label, ...timeProps } = ElTimePicker.props as Omit<typeof timePickerDefaultProps, 'defaultValue'>;

export const timepickerProps = {
    ...timeProps,
    // ...emits2Props(ElTimePicker.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    /** 是否是范围选择 */
    isRange: { type: Boolean as PropType<boolean> },
    /** 日期格式化的类型 */
    valueFormat: { type: String as PropType<string>, default: 'HH:mm:ss' },
    /** 作为字符串时提交的的字段 - 起始字段 */
    beginField: { type: String as PropType<string> },
    /** 作为字符串时提交的的字段 - 结束字段 */
    endField: { type: String as PropType<string> },
} as const;

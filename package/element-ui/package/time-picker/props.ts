import { PropType } from 'vue';
import { TimePicker as ElTimePicker } from 'element-ui';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const timepickerProps = {
    // @ts-expect-error UI.props报错
    ...(ElTimePicker.props as {}),
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

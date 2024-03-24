import { PropType } from 'vue';
import { ElDatePicker } from 'element-plus';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const datepickerProps = {
    ...(ElDatePicker.props as {}),
    // ...emits2Props(ElDatePicker.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    /** 日期格式化的类型 */
    valueFormat: { type: String as PropType<string>, default: 'YYYY-MM-DD' },
    /** 作为字符串时提交的的字段 - 起始字段 */
    beginField: { type: String as PropType<string> },
    /** 作为字符串时提交的的字段 - 结束字段 */
    endField: { type: String as PropType<string> },
} as const;

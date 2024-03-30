import type { PropType } from 'vue-demi';
import { DatePicker as ElDatePicker } from 'element-ui';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

function getProps(data: any): {} {
    const r = { ...data.props };
    data.mixins?.forEach((o: any) => Object.assign(r, getProps(o)));
    return r;
}

/** el-datepicker 所拥有的 props */
export const elDatepickerProps = getProps(ElDatePicker);

export const datepickerProps = {
    ...elDatepickerProps,
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    /** 日期格式化的类型 */
    valueFormat: { type: String as PropType<string>, default: 'yyyy-MM-dd' },
    /** 作为字符串时提交的的字段 - 起始字段 */
    beginField: { type: String as PropType<string> },
    /** 作为字符串时提交的的字段 - 结束字段 */
    endField: { type: String as PropType<string> },
} as const;

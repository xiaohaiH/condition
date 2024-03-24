import { PropType } from 'vue';
import { ElCheckbox } from 'element-plus';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const checkboxProps = {
    ...(ElCheckbox.props as {}),
    // ...emits2Props(ElCheckbox.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    /** 展示的字段 */
    labelKey: { type: String as PropType<string>, default: 'label' },
    /** 提交的字段 */
    valueKey: { type: String as PropType<string>, default: 'value' },
    /** 按钮类型(checkbox|button), 默认 checkbox */
    type: { type: String as PropType<'checkbox' | 'button'> },
    /** 是否多选 */
    multiple: { type: Boolean as PropType<boolean>, default: true },
} as const;

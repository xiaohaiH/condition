import { PropType } from 'vue';
import type { checkboxProps as CheckboxProps } from 'element-plus';
import { ElCheckbox } from 'element-plus';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

const { label, ...cheProps } = ElCheckbox.props as typeof CheckboxProps;

export const checkboxProps = {
    ...cheProps,
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
    /** 选项禁用字段 */
    disabledKey: { type: String as PropType<string>, default: 'disabled' },
} as const;

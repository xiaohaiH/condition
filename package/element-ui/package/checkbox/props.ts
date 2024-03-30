import type { PropType } from 'vue-demi';
import { Checkbox as ElCheckbox } from 'element-ui';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

// @ts-expect-error UI.props报错
export const elCheckboxProps = { ...ElCheckbox.props } as {};
// @ts-expect-error UI.props报错
delete elCheckboxProps.checked;

export const checkboxProps = {
    ...elCheckboxProps,
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

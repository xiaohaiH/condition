import type { PropType } from 'vue-demi';
import { Cascader as ElCascader } from 'element-ui';
import { treeProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const cascaderProps = {
    // @ts-expect-error UI.props报错
    ...(ElCascader.props as {}),
    ...treeProps,
    ...commonProps,
    ...formItemProps,
    /** 展示的字段 */
    labelKey: { type: String as PropType<string>, default: 'label' },
    /** 提交的字段 */
    valueKey: { type: String as PropType<string>, default: 'value' },
    /** 是否可过滤 */
    filterable: { type: Boolean as PropType<boolean>, default: true },
    /** 是否可清除 */
    clearable: { type: Boolean as PropType<boolean>, default: true },
} as const;

import type { PropType } from 'vue-demi';
import { Cascader as ElCascader } from 'element-ui';
import { plainProps } from '@xiaohaih/condition-core';
// import { treeProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

// @ts-expect-error UI.props报错
const { props, ...casProps } = ElCascader.props as {};

export const cascaderProps = {
    ...casProps,
    // ...treeProps,
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    /** ui.cascader.props */
    props: { type: Object as PropType<Record<string, any>> },
    /** 展示的字段 */
    labelKey: { type: String as PropType<string>, default: 'label' },
    /** 提交的字段 */
    valueKey: { type: String as PropType<string>, default: 'value' },
    /** 是否可过滤 */
    filterable: { type: Boolean as PropType<boolean>, default: true },
    /** 是否可清除 */
    clearable: { type: Boolean as PropType<boolean>, default: true },
} as const;

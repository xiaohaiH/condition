import { plainProps } from '@xiaohaih/condition-core';
import { ElCascader } from 'element-plus';
import type { PropType } from 'vue';
// import { treeProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

// @ts-expect-error UI.props报错
const { props, ...casProps } = ElCascader.props as {};

export const cascaderProps = {
    ...casProps,
    // ...emits2Props(ElCascader.emits),
    // ...treeProps,
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    /** ui.cascader.props */
    props: { type: Object as PropType<Record<string, any>> },
    /** 是否可过滤 */
    filterable: { type: Boolean as PropType<boolean>, default: true },
    /** 是否可清除 */
    clearable: { type: Boolean as PropType<boolean>, default: true },
} as const;

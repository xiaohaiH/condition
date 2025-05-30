import { plainProps } from '@xiaohaih/condition-core';
import { ElRadio, ElRadioGroup } from 'element-plus';
import type { PropType } from 'vue';
import { commonProps, formItemProps } from '../share';

// @ts-expect-error UI.props报错
const { label, ...radProps } = ElRadioGroup.props as {};

export const radioProps = {
    ...radProps,
    // ...emits2Props(ElRadio.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    /** 展示的字段 */
    labelKey: { type: String as PropType<string>, default: 'label' },
    /** 提交的字段 */
    valueKey: { type: String as PropType<string>, default: 'value' },
    /** 按钮类型(radio|button), 默认 radio */
    type: { type: String as PropType<'radio' | 'button'> },
    /** 是否带有边框 */
    border: { type: Boolean as PropType<boolean>, default: undefined },
    /** 选中状态是否可以被取消 */
    cancelable: { type: Boolean as PropType<boolean>, default: undefined },
    /** 选项禁用字段 */
    disabledKey: { type: String as PropType<string>, default: 'disabled' },
} as const;

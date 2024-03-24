import { PropType } from 'vue';
import { ElRadio, ElRadioGroup } from 'element-plus';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const radioProps = {
    ...(ElRadioGroup.props as {}),
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
    /** 选中状态是否可以被取消 */
    cancelable: { type: Boolean as PropType<boolean>, default: undefined },
} as const;

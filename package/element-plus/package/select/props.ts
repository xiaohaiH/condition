import { PropType } from 'vue';
import { ElSelect } from 'element-plus';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const selectProps = {
    ...(ElSelect.props as {}),
    // ...emits2Props(ElSelect.emits),
    ...plainProps,
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
    /** 过滤方法 */
    filterMethod: { type: Function as unknown as PropType<(val: string, option: unknown) => boolean> },
    /** 选项禁用字段 */
    disabledKey: { type: String as PropType<string>, default: 'disabled' },
} as const;

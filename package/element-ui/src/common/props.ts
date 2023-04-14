import { PropType } from '@vue/composition-api';
import { ElementUIComponentSize } from 'element-ui/types/component';

/** 条件容器 props */
export const wrapperProps = {
    /** 是否渲染按钮 */
    renderBtn: { type: Boolean as PropType<boolean>, default: true },
    /** 组件大小 */
    size: { type: String as PropType<ElementUIComponentSize> },
    /** 重置时触发搜索事件 */
    resetTriggerSearch: { type: Boolean as PropType<boolean> },
    /** 搜索按钮文字 */
    searchText: { type: String as PropType<string>, default: '搜索' },
    /** 重置按钮文字 */
    resetText: { type: String as PropType<string>, default: '重置' },
} as const;

/** select props */
export const selectProps = {
    filterable: { type: Boolean as PropType<boolean>, default: true },
    clearable: { type: Boolean as PropType<boolean>, default: true },
} as const;

/** input props */
export const inputProps = {
    clearable: { type: Boolean as PropType<boolean>, default: true },
} as const;

/** datepicker props */
export const datepickerProps = {
    /** 日期格式化的类型 - 给了个默认值 */
    valueFormat: { type: String, default: 'yyyy-MM-dd' },
} as const;

/** cascader props */
export const cascaderProps = {
    filterable: { type: Boolean, default: true },
    clearable: { type: Boolean, default: true },
} as const;

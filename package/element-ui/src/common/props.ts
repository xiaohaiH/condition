import { PropType } from 'vue-demi';
import { Select, Input, DatePicker, Cascader } from 'element-ui';
import { ElementUIComponentSize } from 'element-ui/types/component';
import {
    wrapperProps as CoreWrapperProps,
    selectProps as CoreSelectProps,
    inputProps as CoreInputProps,
    datepickerProps as CoreDatepickerProps,
    cascaderProps as CoreCascaderProps,
} from '@xiaohaih/condition-core';

/** 条件容器 props */
export const wrapperProps = {
    ...CoreWrapperProps,
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
    // @ts-ignore
    ...(Select.props as {}),
    ...CoreSelectProps,
    filterable: { type: Boolean as PropType<boolean>, default: true },
    clearable: { type: Boolean as PropType<boolean>, default: true },
} as const;
// @ts-ignore
delete selectProps.value;

/** input props */
export const inputProps = {
    // @ts-ignore
    ...(Input.props as {}),
    ...CoreInputProps,
    clearable: { type: Boolean as PropType<boolean>, default: true },
    rows: { type: Number },
    placeholder: { type: String },
} as const;

/** 提取 mixins 中的 props */
function extractProps(comp: any) {
    const result = {};
    comp.props && Object.assign(result, comp.props);
    comp.mixins?.forEach((o: any) => Object.assign(result, extractProps(o)));
    return result;
}

/** datepicker props */
export const datepickerProps = {
    ...extractProps(DatePicker),
    ...CoreDatepickerProps,
    /** 日期格式化的类型 - 给了个默认值 */
    valueFormat: { type: String, default: 'yyyy-MM-dd' },
} as const;
// @ts-ignore
delete datepickerProps.range;

/** cascader props */
export const cascaderProps = {
    // @ts-ignore
    ...(Cascader.props as {}),
    ...CoreCascaderProps,
    filterable: { type: Boolean, default: true },
    clearable: { type: Boolean, default: true },
} as const;

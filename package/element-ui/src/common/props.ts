import { PropType } from 'vue-demi';
import { Select, Input, DatePicker, Cascader, Radio, RadioGroup } from 'element-ui';
import { ElementUIComponentSize } from 'element-ui/types/component';
import {
    wrapperProps as CoreWrapperProps,
    selectProps as CoreSelectProps,
    inputProps as CoreInputProps,
    datepickerProps as CoreDatepickerProps,
    cascaderProps as CoreCascaderProps,
} from '@xiaohaih/condition-core';

/** 公共 props */
export const commonProps = {
    /** 条件项的标签后缀 */
    labelSuffix: { type: String, default: ':' },
};

/** 条件容器 props */
export const wrapperProps = {
    ...CoreWrapperProps,
    ...commonProps,
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
    ...commonProps,
    filterable: { type: Boolean as PropType<boolean>, default: true },
    clearable: { type: Boolean as PropType<boolean>, default: true },
    /** 条件项标签 */
    label: { type: String },
} as const;
// @ts-ignore
delete selectProps.value;

/** input props */
export const inputProps = {
    // @ts-ignore
    ...(Input.props as {}),
    ...CoreInputProps,
    ...commonProps,
    clearable: { type: Boolean as PropType<boolean>, default: true },
    rows: { type: Number },
    placeholder: { type: String },
    /** 条件项标签 */
    label: { type: String },
    /** 多个输入框之间的间隔 */
    inputSuffix: {
        type: [String, Function, Object] as PropType<string | ((index: number) => any) | any>,
    },
    /** 多个输入框对应的占位语 */
    placeholders: { type: Array as PropType<string[]>, default: () => [] },
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
    ...commonProps,
    /** 日期格式化的类型 - 给了个默认值 */
    valueFormat: { type: String, default: 'yyyy-MM-dd' },
    /** 条件项标签 */
    label: { type: String },
} as const;
// @ts-ignore
delete datepickerProps.range;

/** cascader props */
export const cascaderProps = {
    // @ts-ignore
    ...(Cascader.props as {}),
    ...CoreCascaderProps,
    ...commonProps,
    filterable: { type: Boolean, default: true },
    clearable: { type: Boolean, default: true },
    /** 条件项标签 */
    label: { type: String },
} as const;

/** radio props */
export const radioProps = {
    // @ts-ignore
    ...(RadioGroup.props as {}),
    ...CoreSelectProps,
    ...commonProps,
    /** 按钮类型(radio|button), 默认 radio */
    type: { type: String },
    /** 选中状态是否可以被取消 */
    togglable: { type: Boolean },
    /** 条件项标签 */
    label: { type: String },
} as const;
// @ts-ignore
delete radioProps.value;

import { PropType } from 'vue';
import { HCondition } from '../../interface';
import { ElConfigProvider, ElSelect, ElInput, ElDatePicker, ElCascader, ElRadioGroup } from 'element-plus';
import {
    CoreWrapper,
    wrapperProps as CoreWrapperProps,
    selectProps as CoreSelectProps,
    inputProps as CoreInputProps,
    datepickerProps as CoreDatepickerProps,
    cascaderProps as CoreCascaderProps,
} from '@xiaohaih/condition-core';

const reg = /(^[a-z])|(-[a-z])/g;
/** 首字母大写 */
const capitalize = (_: any, $1: string, $2: string) => ($1 || $2.charAt(1)).toUpperCase();
let result: Record<string, any>, _events: string[];
/** 提取 emits 作为 props */
export function emits2Props(events?: string[] | Record<string, any>) {
    result = {};
    if (!events) return result;
    _events = Array.isArray(events) ? events : Object.keys(events);
    _events.forEach((k) => {
        result[`on${k.replace(reg, capitalize)}`] = { type: Function };
    });
    return result;
}

/** 公共 props */
export const commonProps = {
    /** 条件项的标签后缀 */
    labelSuffix: { type: String, default: ':' },
};

/** 条件容器 props */
export const wrapperProps = {
    ...emits2Props(CoreWrapper.emits),
    ...CoreWrapperProps,
    ...commonProps,
    /** 是否渲染按钮 */
    renderBtn: { type: Boolean as PropType<boolean>, default: true },
    /** 组件大小 */
    size: { type: String as PropType<HCondition.Props<InstanceType<typeof ElConfigProvider>>['size']> },
    /** 重置时触发搜索事件 */
    resetTriggerSearch: { type: Boolean as PropType<boolean> },
    /** 搜索按钮文字 */
    searchText: { type: String as PropType<string>, default: '搜索' },
    /** 重置按钮文字 */
    resetText: { type: String as PropType<string>, default: '重置' },
} as const;

/** select props */
export const selectProps = {
    ...(ElSelect.props as {}),
    ...emits2Props(ElSelect.emits),
    ...CoreSelectProps,
    ...commonProps,
    filterable: { type: Boolean as PropType<boolean>, default: true },
    clearable: { type: Boolean as PropType<boolean>, default: true },
    /** 条件项标签 */
    label: { type: String },
} as const;

/** input props */
export const inputProps = {
    ...(ElInput.props as {}),
    ...emits2Props(ElInput.emits),
    ...CoreInputProps,
    ...commonProps,
    clearable: { type: Boolean as PropType<boolean>, default: true },
    /** 条件项标签 */
    label: { type: String },
    /** 多个输入框之间的间隔 */
    inputSuffix: {
        type: [String, Function, Object] as PropType<string | ((index: number) => any) | any>,
    },
    /** 多个输入框对应的占位语 */
    placeholders: { type: Array as PropType<string[]>, default: () => [] },
} as const;

/** datepicker props */
export const datepickerProps = {
    ...(ElDatePicker.props as {}),
    ...emits2Props(ElDatePicker.emits),
    ...CoreDatepickerProps,
    ...commonProps,
    /** 日期格式化的类型 - 给了个默认值 */
    valueFormat: { type: String, default: 'YYYY-MM-DD' },
    /** 条件项标签 */
    label: { type: String },
} as const;
// @ts-ignore
delete datepickerProps.range;

/** cascader props */
export const cascaderProps = {
    ...(ElCascader.props as {}),
    ...emits2Props(ElCascader.emits),
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
    ...(ElRadioGroup.props as {}),
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

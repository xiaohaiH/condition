import { PropType } from 'vue';
import { HCondition } from '../../interface';
import { ElConfigProvider, ElSelect, ElInput, ElDatePicker, ElCascader } from 'element-plus';
import {
    wrapperProps as CoreWrapperProps,
    selectProps as CoreSelectProps,
    inputProps as CoreInputProps,
    datepickerProps as CoreDatepickerProps,
    cascaderProps as CoreCascaderProps,
} from '@xiaohaih/condition-core';

const reg = /^[a-z]/;
/** 首字母大写 */
const capitalize = (str: string) => str.toUpperCase();
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

/** 条件容器 props */
export const wrapperProps = {
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
    ...CoreWrapperProps,
} as const;

/** select props */
export const selectProps = {
    ...(ElSelect.props as {}),
    ...emits2Props(ElSelect.emits),
    filterable: { type: Boolean as PropType<boolean>, default: true },
    clearable: { type: Boolean as PropType<boolean>, default: true },
    ...CoreSelectProps,
} as const;

/** input props */
export const inputProps = {
    ...(ElInput.props as {}),
    ...emits2Props(ElInput.emits),
    clearable: { type: Boolean as PropType<boolean>, default: true },
    ...CoreInputProps,
} as const;

/** datepicker props */
export const datepickerProps = {
    /** 日期格式化的类型 - 给了个默认值 */
    valueFormat: { type: String, default: 'YYYY-MM-DD' },
    ...CoreDatepickerProps,
    ...(ElDatePicker.props as {}),
    ...emits2Props(ElDatePicker.emits),
} as const;

/** cascader props */
export const cascaderProps = {
    ...(ElCascader.props as {}),
    ...emits2Props(ElCascader.emits),
    filterable: { type: Boolean, default: true },
    clearable: { type: Boolean, default: true },
    ...CoreCascaderProps,
} as const;

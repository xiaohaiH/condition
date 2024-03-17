import { PropType, VNode } from 'vue';
import { HCondition } from '../../interface';
import { ElConfigProvider, ElSelect, ElInput, ElDatePicker, ElCascader, ElRadioGroup, ElCheckbox } from 'element-plus';
import {
    CoreWrapper,
    wrapperProps as CoreWrapperProps,
    plainProps as CorePlainProps,
    treeProps as CoreTreeProps,
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

/** 公共属性 */
export const commonProps = {
    /** 条件前缀(名称) */
    label: { type: String as PropType<string> },
    /** 条件名称对应的后缀(名称和条件间的分隔符) */
    labelSuffix: { type: String as PropType<string> },
    /** 条件后缀(两个条件间的分隔符) */
    postfix: { type: [String, Object, Function] as PropType<string | VNode | ((...args: any[]) => VNode)> },
};

/** 条件容器属性 */
export const wrapperProps = {
    ...emits2Props(CoreWrapper.emits),
    ...CoreWrapperProps,
    /** 条件项的标签后缀 */
    labelSuffix: { type: [String] as PropType<string>, default: ':' },
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

/** 下拉框属性 */
export const selectProps = {
    ...(ElSelect.props as {}),
    ...emits2Props(ElSelect.emits),
    ...CorePlainProps,
    ...commonProps,
    /** 展示的字段 */
    labelKey: { type: String as PropType<string>, required: true },
    filterable: { type: Boolean as PropType<boolean>, default: true },
    clearable: { type: Boolean as PropType<boolean>, default: true },
    /** 过滤方法 */
    filterMethod: { type: Function as unknown as PropType<(val: string, option: unknown) => boolean> },
} as const;

/** 输入框属性 */
export const inputProps = {
    ...(ElInput.props as {}),
    ...emits2Props(ElInput.emits),
    ...CorePlainProps,
    ...commonProps,
    /** 实时触发时做抖动, 防止频繁触发 */
    realtime: { type: Boolean as PropType<boolean>, default: false },
    /** 实时触发时防抖动的时间 */
    waitTime: { type: Number as PropType<number>, default: 300 },
    clearable: { type: Boolean as PropType<boolean>, default: true },
} as const;

/** 日期选择框属性 */
export const datepickerProps = {
    ...(ElDatePicker.props as {}),
    ...emits2Props(ElDatePicker.emits),
    ...CorePlainProps,
    ...commonProps,
    /** 日期格式化的类型 */
    valueFormat: { type: String as PropType<string>, default: 'YYYY-MM-DD' },
    /** 作为字符串时提交的的字段 - 起始字段 */
    beginField: { type: String as PropType<string> },
    /** 作为字符串时提交的的字段 - 结束字段 */
    endField: { type: String as PropType<string> },
} as const;

/** 单选框属性 */
export const radioProps = {
    // @ts-ignore
    ...(ElRadioGroup.props as {}),
    ...CorePlainProps,
    ...commonProps,
    /** 展示的字段 */
    valueKey: { type: String as PropType<string>, required: true },
    /** 展示的字段 */
    labelKey: { type: String as PropType<string>, required: true },
    /** 按钮类型(radio|button), 默认 radio */
    type: { type: String as PropType<string> },
    /** 选中状态是否可以被取消 */
    cancelable: { type: Boolean as PropType<boolean>, default: undefined },
} as const;

/** 复选框属性 */
export const checkboxProps = {
    // @ts-ignore
    ...(ElCheckbox.props as {}),
    ...CorePlainProps,
    ...commonProps,
    /** 展示的字段 */
    valueKey: { type: String as PropType<string>, required: true },
    /** 展示的字段 */
    labelKey: { type: String as PropType<string>, required: true },
    /** 按钮类型(checkbox|button), 默认 checkbox */
    type: { type: String as PropType<string> },
} as const;

/** 级联框属性 */
export const cascaderProps = {
    ...(ElCascader.props as {}),
    ...emits2Props(ElCascader.emits),
    ...CoreTreeProps,
    ...commonProps,
    filterable: { type: Boolean as PropType<boolean>, default: true },
    clearable: { type: Boolean as PropType<boolean>, default: true },
} as const;

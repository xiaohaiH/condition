import { PropType } from 'vue-demi';

/** 改变当前条件值触发方式 */
export interface TriggerOption {
    /**
     * 触发来源
     * @enum {('initial'|'depend')} initial(初始化), depend(依赖项改变)
     */
    trigger: string;
    /** 改变内部的值 */
    change(value: any, updateInitialValue?: boolean): void;
    /** 触发搜索事件 */
    search(value: any, updateInitialValue?: boolean): void;
}
/** 条件值可能的类型 */
export type ValueType = string | string[];

/** 公共 props */
export const commonProps = {
    /** 提交的字段 */
    field: { type: String as PropType<string>, required: true },
    /** 提交的字段(优先使用该字段) - 当某个字段可能存在不同类型时使用 */
    as: { type: String as PropType<string> },
    /** 空置时提交的值 - 默认置为 undefined */
    emptyValue: { type: [String, null, undefined] as PropType<undefined | null | string>, default: undefined },
    /** 重置时是否置为初始值 */
    resetToInitialValue: { type: [Boolean] as PropType<boolean> },
    /** 当前条件对象 - 实时变化 */
    query: { type: Object as PropType<Record<string, any>>, required: true },
    /** 回填值的对象 - 非实时变化 */
    backfill: { type: Object as PropType<Record<string, any>> },
    /** 禁用状态 */
    disabled: { type: [Boolean, Function] as PropType<boolean | ((query: Record<string, any>) => any)> },
    /** 是否隐藏 -> 如果是函数, 需传递依赖项, 可根据依赖项动态隐藏 */
    hide: { type: [Boolean, Function] as PropType<boolean | ((query: Record<string, any>) => any)> },
    /** 校验函数, 返回字符串不通过, 会触发提示 - 提交时触发 */
    validator: {
        type: [Function] as PropType<
            ((query: Record<string, any>) => any) | ((query: Record<string, any>) => Promise<any>)
        >,
    },
    /** 设置默认值 */
    defaultValue: {
        type: [String, Array, Function] as PropType<
            string | string[] | ((query: Record<string, any>, backfill?: Record<string, any>) => ValueType)
        >,
    },
    /** 是否依赖其它字段 */
    depend: { type: Boolean as PropType<boolean> },
    /** 依赖字段 */
    dependFields: { type: [String, Array] as PropType<string | string[]> },
} as const;

/** 条件容器 props */
export const wrapperProps = {
    tag: { type: [String, Object] as PropType<string | object>, default: 'div' },
    /** 重置时是否置为初始值 */
    resetToInitialValue: { type: Boolean as PropType<boolean> },
    /** 数据源 */
    datum: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    /** 回填的数据 */
    backfill: { type: Object as PropType<Record<string, any>> },
    /** 是否需要实时触发搜索事件 */
    realtime: { type: Boolean as PropType<boolean> },
    /** 初始是否触发一次事件来返回当前的 query */
    immediateSearch: { type: Boolean as PropType<boolean> },
    /** 校验不合格的提示 */
    toast: { type: Function as PropType<(msg: string) => void>, default: () => {} },
    /** 数据源发生变化后是否触发一次搜索事件 */
    searchAtDatumChanged: { type: Boolean as PropType<boolean> },
} as const;

/** select props */
export const selectProps = {
    ...commonProps,
    /** 提交给后端的字段 */
    valueKey: { type: String as PropType<string>, required: true },
    /** 展示的字段 */
    labelKey: { type: String as PropType<string>, required: true },
    /** 下拉选项的数据源 */
    options: { type: Array as PropType<Record<string, any>[]>, default: () => [] },
    /** 是否多选 */
    multiple: { type: Boolean as PropType<boolean> },
    /** 获取数据源 */
    getOptions: {
        type: Function as PropType<
            (cb: (data: Record<string, any>[]) => void, query: Record<string, any>, option: TriggerOption) => any
        >,
    },
    /** 自定义筛选方法 */
    filterMethod: { type: Function as PropType<(val: string, data: Record<string, any>) => boolean> },
} as const;

/** input props */
export const inputProps = {
    ...commonProps,
    /** 实时触发时做抖动, 防止频繁触发 */
    realtime: { type: Boolean as PropType<boolean> },
    /** 实时触发时防抖动的时间 */
    waitTime: { type: Number as PropType<number>, default: 300 },
} as const;

/** datepicker props */
export const datepickerProps = {
    ...commonProps,
    /** 是否是范围选择器 */
    range: { type: Boolean as PropType<boolean>, default: false },
    /** 作为字符串时提交的的字段 - 起始字段 */
    beginField: { type: String as PropType<string> },
    /** 作为字符串时提交的的字段 - 结束字段 */
    endField: { type: String as PropType<string> },
} as const;

/** cascader props */
export const cascaderProps = {
    ...commonProps,
    /** 不同层级返回不同的字段(可能存在的字段, 不传初始不会回填数据) */
    fields: { type: [Array] as PropType<string[]> },
    /** 提交给后端的字段 */
    valueKey: { type: String as PropType<string>, required: true },
    /** 子级键名 - 默认 children */
    childrenKey: { type: String as PropType<string> },
    /** 是否返回选中项中所有的值(数组形式), 否只返回最后一项(基础类型) */
    emitPath: { type: [Boolean] as PropType<boolean>, default: false },
    /** 下拉选项的数据源 */
    options: { type: Array as PropType<Record<string, any>[]>, default: () => [] },
    /** 获取数据源 */
    getOptions: {
        type: Function as PropType<
            (cb: (data: Record<string, any>[]) => void, query: Record<string, any>, option: TriggerOption) => any
        >,
    },
} as const;

import { PropType } from 'vue-demi';

/** 公共 props */
export const commonProps = {
    /** 提交的字段 */
    field: { type: String as PropType<string>, required: true },
    /** 空置时提交的值 - 默认置为 undefined */
    emptyValue: { type: [String, null, undefined] as PropType<undefined | null | string>, default: undefined },
    /** 重置时是否置为初始值 */
    resetToInitialValue: { type: [Boolean] as PropType<boolean> },
    /** 显示在 input 框前的文字 */
    prefix: { type: String as PropType<string> },
    /** 当前条件对象 - 实时变化 */
    query: { type: Object as PropType<Record<string, any>>, required: true },
    /** 回填值的对象 - 非实时变化 */
    backfill: { type: Object as PropType<Record<string, any>> },
    /** 禁用状态 */
    disabled: { type: [Boolean, Function] as PropType<boolean | ((query: Record<string, any>) => any)> },
    /** 是否隐藏 -> 如果是函数, 需传递依赖项, 可根据依赖项动态隐藏 */
    hide: { type: [Boolean, Function] as PropType<boolean | ((query: Record<string, any>) => any)> },
    /** 校验函数, 返回字符串不通过, 会触发提示 - 提交时触发 */
    validator: { type: [Function] as PropType<Function | (() => Promise<any>)> },
} as const;

/** 条件容器 props */
export const wrapperProp = {
    tag: { type: String as PropType<string>, default: 'div' },
    /** 数据源 */
    datum: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    /** 回填的数据 */
    backfill: { type: Object as PropType<Record<string, any>> },
    /** 是否需要实时触发搜索事件 */
    realtime: { type: Boolean as PropType<boolean> },
    /** 初始是否触发一次事件来返回当前的 query */
    immediateTrigger: { type: Boolean as PropType<boolean> },
    /** 校验不合格的提示 */
    toast: { type: Function as PropType<(msg: string) => void>, default: () => {} },
} as const;

/** select props */
export const selectProps = {
    ...commonProps,
    /** 提交给后端的字段 */
    valueKey: { type: String as PropType<string> },
    /** 展示的字段 */
    labelKey: { type: String as PropType<string> },
    /** 下拉选项的数据源 */
    option: { type: Array as PropType<Record<string, any>[]>, default: () => [] },
    /** 是否多选 */
    multiple: { type: Boolean as PropType<boolean> },
    /** 是否依赖其它字段 - 字典请求 */
    depend: { type: Boolean as PropType<boolean> },
    /** 依赖字段 - 字段发生改变时做请求 */
    dependFields: { type: [String, Array] as PropType<string | string[]> },
    /** 获取数据 */
    getDict: {
        type: Function as PropType<(cb: (data: Record<string, any>[]) => void, query: Record<string, any>) => any>,
    },
    /** 是否允许清空 - 默认允许 */
    clearable: { type: Boolean as PropType<boolean>, default: true },
    /** 自定义筛选方法 */
    filterMethod: { type: Function as PropType<(val: string, data: Record<string, any>) => boolean> },
} as const;

/** input props */
export const inputProps = {
    ...commonProps,
    /** 实时触发时做抖动, 防止频繁触发 */
    realtime: { type: Boolean as PropType<boolean> },
    /** 实时触发时防抖动的时间 */
    waitTimer: { type: Number as PropType<number>, default: 300 },
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
export const cascadertProps = {
    ...commonProps,
    /** 不同层级返回不同的字段(可能存在的字段, 不传初始不会回填数据) */
    fields: { type: [String, Array] as PropType<string | string[]> },
    /** 不同层级返回不同的字段格式化函数 */
    formatField: { type: Function as PropType<(...args: any[]) => Record<string, any>>, required: true },
    /** 提交给后端的字段 */
    valueKey: { type: String as PropType<string> },
    /** 展示的字段 */
    labelKey: { type: String as PropType<string> },
    /** 下拉选项的数据源 */
    option: { type: Array as PropType<Record<string, any>[]>, default: () => [] },
    /** 是否依赖其它字段 - 字典请求 */
    depend: { type: Boolean as PropType<boolean> },
    /** 依赖字段 - 字段发生改变时做请求 */
    dependFields: { type: [String, Array] as PropType<string | string[]> },
    /** 获取数据 */
    getDict: {
        type: Function as PropType<(cb: (data: Record<string, any>[]) => void, query: Record<string, any>) => any>,
    },
    /** 是否可以被清空 */
    clearable: { type: Boolean, default: true },
    /** 自定义筛选方法 */
    filterMethod: { type: Function as PropType<(val: string, data: Record<string, any>) => boolean> },
} as const;

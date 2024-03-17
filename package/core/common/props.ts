import { PropType } from 'vue-demi';
import { CommonMethod } from './provide';
import { type emptyToValue as _emptyToValue } from '../utils/index';

/** 改变当前条件值触发方式 */
export interface TriggerOption {
    /**
     * 触发来源
     * @enum {('initial'|'depend')} initial(初始化), depend(依赖项改变)
     */
    trigger: string;
    /**
     * 仅改变内部的值, 不触发搜索事件
     * @param {*} value 需改变的值
     * @param {boolean} [updateInitialValue] 是否将该值作为初始值(重置时使用)
     */
    change(value: any, updateInitialValue?: boolean): void;
    /**
     * 触发搜索事件
     * @param {*} value 需改变的值
     * @param {boolean} [updateInitialValue] 是否将该值作为初始值(重置时使用)
     */
    search(value: any, updateInitialValue?: boolean): void;
}
/** 条件值可能的类型 */
export type ValueType = string | string[];
/** 条件值可能的类型 */
export type GetQuery = (
    value: any | any[],
    emptyToValue: typeof _emptyToValue,
    props: Record<string, any>,
) => Record<string, any>;

type HideOption =
    | boolean
    | ((query: {
          /** 实时 query */
          query: Record<string, any>;
          /** 回填值 query */
          backfill?: Record<string, any>;
          /** 当前组件暴露给父级的选项 */
          option: CommonMethod;
      }) => any);
type GetOption = (
    /** 数据执行后的回调 */
    cb: (data: Record<string, any>[]) => void,
    /** 当前 query 对象 */
    query: Record<string, any>,
    /** 额外的配置项 */
    option: TriggerOption,
) => any;

/** 公共 props */
export const commonProps = {
    /** 提交的字段 */
    field: { type: String as PropType<string>, required: true },
    /** 提交的字段(优先使用该字段) - 当某个字段可能存在不同类型时使用 */
    as: { type: String as PropType<string> },
    /** 自定义返回字段 */
    customGetQuery: { type: Function as PropType<GetQuery> },
    /** 空置时提交的值 - 默认置为 undefined */
    emptyValue: { type: [String, null, undefined] as PropType<undefined | null | string>, default: undefined },
    /** 重置时是否置为初始值 */
    resetToInitialValue: { type: [Boolean] as PropType<boolean> },
    /** 当前条件对象 - 实时变化 */
    query: { type: Object as PropType<Record<string, any>>, required: true },
    /** 回填值的对象 - 非实时变化 */
    backfill: { type: Object as PropType<Record<string, any>> },
    /** 禁用状态 */
    disabled: { type: [Boolean, Function] as PropType<HideOption> },
    /** 是否隐藏 -> 如果是函数, 需传递依赖项, 可根据依赖项动态隐藏 */
    hide: { type: [Boolean, Function] as PropType<HideOption> },
    /** 校验函数, 返回字符串不通过, 会触发提示 - 提交时触发 */
    validator: {
        type: [Function] as PropType<
            ((query: Record<string, any>) => any) | ((query: Record<string, any>) => Promise<any>)
        >,
    },
    /** 设置默认值 */
    defaultValue: {
        type: [String, Array, Function] as PropType<
            ValueType | ((query: Record<string, any>, backfill?: Record<string, any>) => ValueType)
        >,
    },
    /** 是否依赖其它字段 */
    depend: { type: Boolean as PropType<boolean>, default: undefined },
    /** 依赖字段 */
    dependFields: { type: [String, Array] as PropType<string | string[]> },
} as const;

/** 条件容器 props */
export const wrapperProps = {
    tag: { type: [String, Object] as PropType<string | object>, default: 'div' },
    /** 重置时是否置为初始值 */
    resetToInitialValue: { type: Boolean as PropType<boolean>, default: undefined },
    /** 数据源 */
    datum: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    /** 回填的数据 */
    backfill: { type: Object as PropType<Record<string, any>> },
    /** 是否需要实时触发搜索事件 */
    realtime: { type: Boolean as PropType<boolean>, default: undefined },
    /** 初始是否触发一次事件来返回当前的 query */
    immediateSearch: { type: Boolean as PropType<boolean>, default: undefined },
    /** 校验不合格的提示 */
    toast: { type: Function as PropType<(msg: string) => void>, default: () => {} },
    /** 数据源发生变化后是否触发一次搜索事件 */
    searchAtDatumChanged: { type: Boolean as PropType<boolean>, default: undefined },
} as const;

/** 普通类型的 props */
export const plainProps = {
    ...commonProps,
    /** 字段集(多选时, 每个下标对应的字段可能不一样) */
    fields: { type: [Array] as PropType<string[]> },
    /** 多字段时转换成选中值 */
    backfillToValue: {
        type: Function as PropType<
            (values: string | string[], fields: string | string[], backfill?: Record<string, any>) => string | string[]
        >,
        default: (v: any) => v,
    },
    /** 数据源 */
    options: { type: Array as PropType<Record<string, any>[]>, default: () => [] },
    /** 是否多选 */
    multiple: { type: Boolean as PropType<boolean>, default: undefined },
    /** 动态获取数据源 */
    getOptions: { type: Function as PropType<GetOption> },
} as const;

/** tree props */
export const treeProps = {
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
    getOptions: { type: Function as PropType<GetOption> },
} as const;

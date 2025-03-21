import type { PropType, WatchOptions } from 'vue-demi';
import type { emptyToValue as EmptyToValue } from '../utils/index';
import type { CommonMethod } from './constant';

/** 隐藏元素 */
export type HideOption =
    | boolean
    | ((query: {
        /** 实时 query */
        query: Record<string, any>;
        /** 回填值 query */
        backfill?: Record<string, any>;
        /** 当前组件暴露给父级的选项 */
        option: CommonMethod;
    }) => any);

/** 获取远程数据源 */
export interface GetOptions {
    (
        /** 数据执行后的回调 */
        cb: (data: Record<string, any>[]) => void,
        /** 当前 query 对象 */
        query: Record<string, any>,
        /** 额外的配置项 */
        option: TriggerOption,
    ): any;
}

/** 条件值可能的类型 */
export type ValueType = number | string | boolean | any[] | Record<string, any>;

/** 改变当前条件值触发方式 */
export interface TriggerOption {
    /**
     * 触发来源
     * @enum {('initial'|'depend')} initial(初始化), depend(依赖项改变)
     */
    trigger: string;
    /**
     * 所有条件的数据源
     * @enum {Record<string, Record<string, any>[]>}
     */
    options: Record<string, Record<string, any>[]>;
    /**
     * 仅更改默认值
     * @param {*} value 需改变的值
     */
    changeDefaultValue: (value: any) => this;
    /**
     * 仅改变内部的值, 不触发搜索事件
     * @param {*} value 需改变的值
     * @param {boolean} [updateInitialValue] 是否将该值作为初始值(重置时使用)
     */
    change: (value: any, updateInitialValue?: boolean) => this;
    /**
     * 触发搜索事件
     * @param {*} value 需改变的值
     * @param {boolean} [updateInitialValue] 是否将该值作为初始值(重置时使用)
     */
    search: (value: any, updateInitialValue?: boolean) => this;
}

/** 自定义返回字段 */
export type GetQuery = (
    value: any | any[],
    emptyToValue: typeof EmptyToValue,
    props: Record<string, any>,
) => Record<string, any>;

/** 公共 props */
export const commonProps = {
    /** 提交的字段 */
    field: { type: String as PropType<string>, required: true },
    /** 是否多选 */
    multiple: { type: Boolean as PropType<boolean>, default: undefined },
    /** 当前条件对象 - 实时变化 */
    query: { type: Object as PropType<Record<string, any>>, required: true },
    /** 回填值的对象 - 非实时变化 */
    backfill: { type: Object as PropType<Record<string, any>> },
    /** 禁用状态 */
    disabled: { type: [Boolean, Function] as PropType<HideOption> },
    /** 是否隐藏 -> 如果是函数, 需传递依赖项, 可根据依赖项动态隐藏 */
    hide: { type: [Boolean, Function] as PropType<HideOption> },
    /** 是否依赖其它字段 */
    depend: { type: Boolean as PropType<boolean> },
    /** 依赖字段发生变化后是否重置值 */
    resetByDependValueChange: { type: [Boolean, Function] as PropType<boolean | ((query: Record<string, any>) => boolean)>, default: true },
    /** 依赖字段 */
    dependFields: { type: [String, Array] as PropType<string | string[]> },
    /** 依赖字段监听选项 */
    dependWatchOption: { type: [Object] as PropType<WatchOptions> },
    /** 是否依赖其它字段的数据源 - 数据发生变动时触发 getOptions */
    optionsDepend: { type: Boolean as PropType<boolean> },
    /** 数据源依赖字段 - 不传取 dependFields */
    optionsDependFields: { type: [String, Array] as PropType<string | string[]> },
    /** 重置时是否置为初始值 */
    resetToInitialValue: { type: [Boolean] as PropType<boolean> },
    /** 空置时提交的值 - 默认置为 undefined */
    emptyValue: {
        type: [String, Number, Boolean, null, undefined] as PropType<undefined | null | boolean | string | number>,
        default: undefined,
    },
    /** 校验函数, 返回字符串不通过, 会触发提示 - 提交时触发 */
    validator: {
        type: [Function] as PropType<
            ((query: Record<string, any>) => any) | ((query: Record<string, any>) => Promise<any>)
        >,
    },
    /** 自定义返回字段 */
    customGetQuery: { type: Function as PropType<GetQuery> },
    /** 设置默认值 */
    defaultValue: {
        type: [String, Number, Boolean, Function, Array, Object] as PropType<
            ValueType | ((query: Record<string, any>, backfill?: Record<string, any>) => ValueType)
        >,
        default: undefined,
    },
} as const;

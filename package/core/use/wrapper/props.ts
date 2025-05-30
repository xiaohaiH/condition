import type { PropType } from 'vue-demi';

/** 条件容器 props */
export const wrapperProps = {
    /** 是否在数据发生变动后实时触发搜索事件 */
    realtime: { type: Boolean as PropType<boolean>, default: undefined },
    /** 是否在数据源发生改变后触发一次搜索事件 */
    searchAtDatumChanged: { type: Boolean as PropType<boolean>, default: undefined },
    /** 回填信息 */
    backfill: { type: Object as PropType<Record<string, any>> },
    /** 校验失败时产生的提示 */
    toast: { type: Function as PropType<(msg: string) => void>, default: undefined },
    /** 配置空值 */
    emptyValues: { type: Array as PropType<any[]>, default: () => ['', null, undefined] },
    /** 设置空值时返回的值 */
    emptyValue: { type: Function as PropType<() => any>, default: undefined },
} as const;

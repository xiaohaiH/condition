import { PropType } from 'vue-demi';
import { commonProps, type GetOptions } from '../share';

/** 扁平条件类 props */
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
    /** 动态获取数据源 */
    getOptions: { type: Function as PropType<GetOptions> },
} as const;

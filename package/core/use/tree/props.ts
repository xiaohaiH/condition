import { PropType } from 'vue-demi';
import { commonProps, type GetOptions } from '../share';

/** 树形条件类 props */
export const treeProps = {
    ...commonProps,
    /** 不同层级返回不同的字段(可能存在的字段, 不传初始不会回填数据) */
    fields: { type: [Array] as PropType<string[]> },
    /** 提交给后端的字段 */
    valueKey: { type: String as PropType<string>, required: true },
    /** 子级键名 - 默认 children */
    childrenKey: { type: String as PropType<string> },
    /** 是否返回全路径 */
    emitPath: { type: [Boolean] as PropType<boolean>, default: false },
    /** 下拉选项的数据源 */
    options: { type: Array as PropType<Record<string, any>[]>, default: () => [] },
    /** 获取数据源 */
    getOptions: { type: Function as PropType<GetOptions> },
} as const;

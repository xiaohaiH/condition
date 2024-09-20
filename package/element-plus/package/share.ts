import type { PropType, VNode } from 'vue';
import { ElFormItem } from 'element-plus';

interface SlotQuery {
    /** 是否禁用 */
    disabled: boolean;
    /** 绑定的值 */
    modelValue: any;
    /** 内部设置的类名 */
    class: string;
    /** 组件内部信息 */
    extraOption: {
        /** 表单信息值 */
        query: Record<string, any>;
        /** 触发外部搜索事件 */
        search(): void;
        /** 触发内部搜索事件 */
        insideSearch(): void;
    };
    [index: string]: string | number | boolean | ((...args: any[]) => any) | Record<string, any> | any[];
}

/** 公共属性 */
export const commonProps = {
    /** 条件后缀(两个条件间的分隔符) */
    postfix: { type: [String, Object, Function] as PropType<string | VNode | ((...args: any[]) => VNode)> },
    /** 字段别名(优先级高于条件对象的 key) */
    as: { type: String as PropType<string> },
    /** 开启排序时, 排序下标 @default 0 */
    conditionSortIndex: { type: Number as PropType<number> },
    /** 返回动态渲染的字段 */
    dynamicFields: {
        type: Function as PropType<(option: { query: Record<string, any> }) => Record<string, any> | void>,
    },
    /** 表单项返回动态渲染的字段 */
    formDynamicFields: {
        type: Function as PropType<(option: { query: Record<string, any> }) => Record<string, any> | void>,
    },
    /** 默认插槽 */
    slotDefault: { type: [Object, Function] as PropType<VNode | ((option: SlotQuery) => VNode)> },
    /** 默认插槽 */
    slotBefore: { type: [Object, Function] as PropType<VNode | ((option: SlotQuery) => VNode)> },
    /** 默认插槽 */
    slotAfter: { type: [Object, Function] as PropType<VNode | ((option: SlotQuery) => VNode)> },
};

export const formItemProps = {
    ...(ElFormItem.props as {}),
    class: { type: [Object, Array, String] as PropType<string | Record<string, any> | any[]> },
    style: { type: [Object, Array, String] as PropType<string | Record<string, any> | any[]> },
    prop: { type: [String, Array] as PropType<string | string[]> },
};
export const formItemPropKeys = Object.keys(formItemProps);

import type { PropType, VNode } from 'vue';
import { ElFormItem } from 'element-plus';

/** 公共属性 */
export const commonProps = {
    /** 条件后缀(两个条件间的分隔符) */
    postfix: { type: [String, Object, Function] as PropType<string | VNode | ((...args: any[]) => VNode)> },
    /** 字段别名(优先级高于条件对象的 key) */
    as: { type: String as PropType<string> },
};

export const formItemProps = {
    ...(ElFormItem.props as {}),
    class: { type: [Object, Array, String] as PropType<string | Record<string, any> | any[]> },
    style: { type: [Object, Array, String] as PropType<string | Record<string, any> | any[]> },
    prop: { type: [String, Array] as PropType<string | string[]> },
};
export const formItemPropKeys = Object.keys(formItemProps);

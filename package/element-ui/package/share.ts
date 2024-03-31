import type { PropType, VNode } from 'vue-demi';
import { FormItem as ElFormItem } from 'element-ui';

/** 公共属性 */
export const commonProps = {
    /** 条件后缀(两个条件间的分隔符) */
    postfix: { type: [String, Object, Function] as PropType<string | VNode | ((...args: any[]) => VNode)> },
    /** 字段别名(优先级高于条件对象的 key) */
    as: { type: String as PropType<string> },
};

export const formItemProps = {
    // @ts-expect-error UI.props报错
    ...(ElFormItem.props as {}),
    prop: { type: [String, Array] as PropType<string | (string | number)[]> },
};
export const formItemPropKeys = Object.keys(formItemProps);

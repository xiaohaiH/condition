import { PropType } from 'vue';
import { ElForm } from 'element-plus';
import { wrapperProps as CoreWrapperProps } from '@xiaohaih/condition-core';

export const formPropKeys = Object.keys(ElForm.props).concat('class', 'style');

/** 条件容器属性 */
export const wrapperProps = {
    ...(ElForm.props as {}),
    ...CoreWrapperProps,
    class: { type: [Object, Array, String] as PropType<string | Record<string, any> | any[]> },
    style: { type: [Object, Array, String] as PropType<string | Record<string, any> | any[]> },
    /** 数据源 */
    datum: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    /** 重置时是否置为初始值 */
    resetToInitialValue: { type: Boolean as PropType<boolean> },
    /** 初始是否触发一次事件来返回当前的 query */
    immediateSearch: { type: Boolean as PropType<boolean> },
    /** 是否渲染搜索重置按钮 */
    renderBtn: { type: Boolean as PropType<boolean>, default: true },
    /** 重置时触发搜索事件 */
    resetTriggerSearch: { type: Boolean as PropType<boolean> },
    /** 搜索按钮文字 */
    searchText: { type: String as PropType<string>, default: '搜索' },
    /** 重置按钮文字 */
    resetText: { type: String as PropType<string>, default: '重置' },
} as const;

export const wrapperEmits = {
    /** 搜索事件 - 触发内部 query 对象更新 */
    search: (query: Record<string, any>) => true,
    /** query 已初始化 */
    ready: (query: Record<string, any>) => true,
    /** 重置事件 */
    reset: (query: Record<string, any>) => true,
};

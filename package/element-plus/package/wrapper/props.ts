import { wrapperProps as CoreWrapperProps } from '@xiaohaih/condition-core';
import type { componentSizes } from 'element-plus';
import { ElForm } from 'element-plus';
import type { PropType } from 'vue';

export const formPropKeys = Object.keys(ElForm.props).concat('class', 'style');

/** 条件容器属性 */
export const wrapperProps = {
    size: { type: String as PropType<(typeof componentSizes)[number]> },
    ...(ElForm.props as {}),
    ...CoreWrapperProps,
    class: { type: [Object, Array, String] as PropType<string | Record<string, any> | any[]> },
    style: { type: [Object, Array, String] as PropType<string | Record<string, any> | any[]> },
    /** 数据源 */
    datum: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    /** 是否启用排序 */
    sortable: { type: Boolean as PropType<boolean> },
    /** 重置时是否置为初始值 */
    resetToInitialValue: { type: Boolean as PropType<boolean>, default: undefined },
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
    /** query 已初始化 */
    ready: (query: Record<string, any>) => true,
    /** 搜索事件 - 触发内部 query 对象更新 */
    search: (query: Record<string, any>) => true,
    /** 重置事件 */
    reset: (query: Record<string, any>) => true,
    /**
     * 字段值发生改变时触发
     * @param {object} option 提供的
     * @param {string} option.field 实际改变的键
     * @param {*} option.value
     * @param {object} option.query
     * @param {string} option.nativeField 原始健(不受 as, fields 等属性影响)
     */
    fieldChange: (option: { field: string; value: any; query: Record<string, any>; nativeField: string }) => true,
};

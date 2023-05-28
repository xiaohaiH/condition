import { isVue2, SetupContext, version, VNode } from 'vue-demi';
import { hasOwn } from './index';

/**
 * 获取指定事件
 * @param {SetupContext} ctx vue 实例上下文
 * @param {string} eventName 事件名称
 */
export function getEvent<T extends (...args: any[]) => any>(ctx: SetupContext<any>, eventName: string): T | undefined {
    return (
        isVue2
            ? // @ts-ignore
              ctx.listeners[eventName]
            : ctx.attrs[`on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`]
    ) as T;
}

/**
 * 判断是否存在指定事件
 * @param {SetupContext} ctx vue 实例上下文
 * @param {string} eventName 事件名称
 */
export function existsEvent(ctx: SetupContext<any>, eventName: string) {
    return !!getEvent(ctx, eventName);
}

/**
 * 获取指定插槽
 * @param {string} slotName 插槽名称
 */
export function getSlot(slotName: string, vm: Record<string, any>): ((props: any) => VNode) | VNode | undefined {
    // ): ((props: any) => VNode[] | undefined) | VNode[] | undefined {
    return (hasOwn(vm, '$scopedSlots') && vm.$scopedSlots[slotName]) || vm.$slots[slotName];
}

/** 判断是否是 2.7.* 版本, 监听生命周期需对该版本做处理 */
export const IS_COMPOSITION_VERSION = version.slice(0, 3) === '2.7';

/** vue2 和 vue3 的 value 值不一致 */
export const VALUE_KEY = isVue2 ? 'value' : 'modelValue';

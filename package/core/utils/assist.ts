import { isVue2, SetupContext } from 'vue-demi';

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

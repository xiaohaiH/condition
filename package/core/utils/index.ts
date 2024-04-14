import { markRaw, VNode } from 'vue-demi';

/**
 * 空值转为提供的默认值
 * @param {*} val 值为空时转为默认值
 * @param {*} defaultVal
 */
export function emptyToValue<T extends unknown>(val: any, defaultVal: T) {
    if (Array.isArray(val)) return val.filter(Boolean).length ? val : defaultVal;
    return typeof val === 'number' ? val : val || defaultVal;
}

/**
 * 对值进行浅拷贝
 * @param {*} val
 */
export function shallowDeep<T extends unknown>(val: T): T {
    return Array.isArray(val) ? ([...val] as T) : val;
}

/**
 * 获取指定层级的父级(包括自身)
 * @param {Record<string, any>[]} data 数据源
 * @param {(item) => boolean} cb 当前数据项是否匹配
 */
export function getChained<T extends Record<string, any>>(
    data: T[],
    cb: (item: T) => boolean,
    childrenKey = 'children',
): T[] {
    for (const item of data) {
        if (cb(item)) {
            return [item];
        } else if (item[childrenKey]?.length) {
            const r = getChained(item[childrenKey], cb);
            if (r.length) {
                r.unshift(item);
                return r;
            }
        }
    }
    return [];
}

/**
 * 获取渲染节点
 * @param {string | Object | Function} node 需渲染元素
 */
export function getNode(node: string | ((...args: any[]) => VNode) | VNode | undefined | null, ...args: any[]) {
    // 直接抛出 null, template 中会报错
    if (!node) return null as unknown as {};
    return typeof node === 'function' ? node(...args) : typeof node === 'string' ? node : markRaw(node);
}

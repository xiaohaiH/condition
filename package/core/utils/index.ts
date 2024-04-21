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

/** 判断两个值是否相等, 排除掉空值 */
export function isEqualExcludeEmptyValue(x: any, y: any) {
    return (isEmptyValue(x) && isEmptyValue(y)) || isEqual(x, y);
}

/** 判断是否是空值(null, undefined, '') */
export function isEmptyValue(val: any) {
    return val === undefined || val === '' || val === null;
}

/** 判断两个值是否一致 */
export function isEqual(x: any, y: any): boolean {
    if (Object.is(x, y)) return true;
    if (x instanceof Date && y instanceof Date) {
        return x.getTime() === y.getTime();
    }
    if (x instanceof RegExp && y instanceof RegExp) {
        return x.toString() === y.toString();
    }
    if (typeof x !== 'object' || x === null || typeof y !== 'object' || y === null) {
        return false;
    }
    const keysX = Reflect.ownKeys(x as unknown as object) as (keyof typeof x)[];
    const keysY = Reflect.ownKeys(y as unknown as object);
    if (keysX.length !== keysY.length) return false;
    for (let i = 0; i < keysX.length; i++) {
        if (!Reflect.has(y as unknown as object, keysX[i])) return false;
        if (!isEqual(x[keysX[i]], y[keysX[i]])) return false;
    }
    return true;
}

/** 判断是否是原始类型(number , string , boolean , symbol, bigint, undefined, null) */
export function isPrimitive(value: any) {
    return value === undefined || value === null || (typeof value !== 'object' && typeof value !== 'function');
}

/** 拷贝 */
export function clone<T>(obj: T, deep?: boolean): T {
    if (isPrimitive(obj)) return obj;
    if (typeof obj === 'function') return obj.bind({});
    const newObj = new ((obj as object).constructor as { new (): T })();
    Object.getOwnPropertyNames(obj).forEach((prop) => {
        (newObj as any)[prop] = deep ? clone((obj as any)[prop]) : (obj as any)[prop];
    });
    return newObj;
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

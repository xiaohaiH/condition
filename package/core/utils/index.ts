/**
 * 判断对象是否存在指定属性
 * @param {object} obj
 * @param {string} name
 */
export function hasOwn(obj: Record<string, any>, name: string) {
    return Object.prototype.hasOwnProperty.call(obj, name);
}

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

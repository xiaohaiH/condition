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
    return typeof val === 'number' ? val : val || defaultVal;
}

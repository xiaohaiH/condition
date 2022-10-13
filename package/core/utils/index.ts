/**
 * 判断对象是否存在指定属性
 * @param {object} obj
 * @param {string} name
 */
export function hasOwn(obj: Record<string, any>, name: string) {
    return Object.prototype.hasOwnProperty.call(obj, name);
}

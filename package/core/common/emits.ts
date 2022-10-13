/** 通用 emits */
export const commonEmits = {
    /** 搜索事件 - 触发内部 query 对象更新 */
    search: (query: Record<string, any>) => {},
};

/** 条件容器 emits */
export const wrapperEmits = {
    ...commonEmits,
    /** query 已初始化 */
    ready: (query: Record<string, any>) => {},
};

/** select emits */
export const selectEmits = {
    ...commonEmits,
    /** 失焦进行检索 */
    blur: (...args: any[]) => {},
};

/** 通用 emits */
export const commonEmits = {
    /** 搜索事件 - 触发内部 query 对象更新 */
    search: (query: Record<string, any>) => true,
};

/** 条件容器 emits */
export const wrapperEmits = {
    ...commonEmits,
    /** query 已初始化 */
    ready: (query: Record<string, any>) => true,
    /** 重置事件 */
    reset: (query: Record<string, any>) => true,
};

/** plain emits */
export const selectEmits = {
    ...commonEmits,
};

/** tree emits */
export const treeEmits = {
    ...commonEmits,
};

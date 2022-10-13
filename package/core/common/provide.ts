/** 容器注入的 key */
export const provideKey = 'condition-wrapper';

/** 容器注入值的类型 */
export interface ProvideValue {
    /** 子组件渲染后需主动注册组件 */
    register(config: CommonMethod): void;
}

/**
 * 子组件需暴露出来的公共属性
 */
export interface CommonMethod {
    /**
     * 重置
     */
    reset(): CommonMethod;
    /**
     * 校验方法
     */
    validator?(query: Record<string, string>): Promise<any> | any;
    /**
     * 获取该组件拼接的参数
     */
    getQuery(): Record<string, any>;
}

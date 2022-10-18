import { type Ref } from 'vue-demi';

/** 容器注入的 key */
export const provideKey = 'condition-wrapper';

/** 容器注入值的类型 */
export interface ProvideValue {
    /**
     * 是否实时触发
     */
    realtime: Ref<boolean | undefined>;
    /**
     * 子组件需主动注册组件, 否则不会生效
     * @param {CommonMethod} compOption 提供父组件校验, 重置等方法
     *
     * @returns {() => void} 取消注册 - 默认会自动取消, 如果是异步任务内注册, 需自己手动取消
     */
    register(config: CommonMethod): () => void;
    /**
     * 子组件通知父级更新 query 中的值 - 静默修改, 不触发搜索事件
     * @param {string} field 更新的字段
     * @param {*} value 更新的值
     */
    updateQueryValue(field: string, value: any): ProvideValue;
    /**
     * 子组件内部值发生了变动, 由父级决定是否触发搜索事件(实时搜索时需要区分这两种方式)
     */
    insetSearch(): ProvideValue;
    /**
     * 提供给组件内部的直接触发到外部的搜索事件
     */
    search(): Promise<string | void>;
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
     * 更新父级中 query 的值
     */
    updateWrapperQuery(): CommonMethod;
    /**
     * 校验方法
     */
    validator?(query: Record<string, string>): Promise<any> | any;
    /**
     * 获取该组件拼接的参数
     */
    getQuery(): Record<string, any>;
}

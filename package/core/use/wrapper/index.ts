import { del, getCurrentInstance, onBeforeUnmount, provide, ExtractPropTypes, ref, set, watch, toRefs } from 'vue-demi';
import { IS_COMPOSITION_VERSION, provideKey, ProvideValue, CommonMethod, defineProvideValue } from '../constant';
import { wrapperProps } from './props';

/** 外部需传递的 props */
export type WrapperProps = ExtractPropTypes<typeof wrapperProps> & {
    /** 触发搜索事件 */
    search?: (params: Record<string, any>) => void;
    /** 触发重置事件 */
    reset?: (params: Record<string, any>) => void;
};

/** 封装 wrapper 组件必备的信息 */
export function useWrapper(props: WrapperProps) {
    const child: CommonMethod[] = [];
    onBeforeUnmount(() => child.splice(0));

    /**
     * #fix 修复初始 backfill 存在值时
     * query 未保持一致的问题
     * 解决方案:
     * query 本身逻辑和作用不变
     * 新增一个对象用来缓存更改的值
     * 并在获取 query 时, 将该对象作为
     * 最后一个合并项
     */
    const changedQueryObj = {} as Record<string, any>;
    /** 是否标记更新的字段, 防止卸载后的空字段占位 */
    let isLogField = false;
    let logFields: string[] = [];
    /** 提供给子条件组件的方法 */
    const wrapperInstance = defineProvideValue({
        realtime: ref(props.realtime),
        register(compOption) {
            child.push(compOption);
            const unregister = () => {
                isLogField = true;
                compOption.reset();
                compOption.updateWrapperQuery();
                const idx = child.indexOf(compOption);
                idx !== -1 && child.splice(idx, 1);
                props.searchAtDatumChanged && search();
                // TODO 不确定的一点, 数据源更改后是否需要重置整个数据
                // 如果需要重置, 得更新后第一次搜索事件时传递的搜索值
                isLogField = false;
                logFields.forEach((k) => {
                    del(query.value, k);
                    delete changedQueryObj[k];
                });
                logFields = [];
            };
            const childInstance = getCurrentInstance();
            // vue2.7 实例挂载在 proxy 上, 内部逻辑取的 proxy 上的值
            // 虽然 @vue/composition-api 实例挂载在 proxy 上
            // 但是内部逻辑取的是整个 getCurrentInstance
            // @ts-expect-error vue2.7中取proxy属性
            childInstance && onBeforeUnmount(unregister, IS_COMPOSITION_VERSION ? childInstance.proxy : childInstance);
            return unregister;
        },
        updateQueryValue(field, value) {
            if (isLogField) logFields.push(field);
            set(query.value, field, value);
            changedQueryObj[field] = value;
        },
        insetSearch() {
            props.realtime && search();
        },
        search,
        removeUnreferencedField(field: string) {
            let sameFieldCount = 0;
            child.some((v) => {
                v.getQuery().hasOwnProperty(field) && (sameFieldCount += 1);
                return sameFieldCount;
            });
            if (!sameFieldCount) {
                del(query.value, field);
                delete changedQueryObj[field];
            }
        },
    });
    provide<ProvideValue>(provideKey, wrapperInstance);

    /** 内部条件最新的值, 在没触发搜索按钮前, 不会同步到外部 */
    const query = ref<Record<string, string>>({ ...props.backfill });
    const getQuery = () => ({ ...query.value, ...props.backfill, ...changedQueryObj });

    async function search() {
        const msg = await validate();
        msg ? props.toast?.(msg) : props.search?.(getQuery());
    }
    /** 重置所有条件的值 */
    function reset() {
        child.forEach((v) => {
            v.reset();
            v.updateWrapperQuery();
        });
        props.reset?.(getQuery());
    }
    /** 自定义校验条件的值 */
    async function validate() {
        const r = await Promise.all(child.map((v) => v.validator?.(query.value)));
        return r.find((v) => v && typeof v === 'string') as string;
    }

    return {
        child,
        wrapperInstance,
        query,
        getQuery,
        search,
        reset,
        validate,
    };
}

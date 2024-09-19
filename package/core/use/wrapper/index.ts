import {
    del,
    getCurrentInstance,
    onBeforeUnmount,
    provide,
    ExtractPropTypes,
    ref,
    set,
    watch,
    toRefs,
    nextTick,
    toRef,
    computed,
    reactive,
} from 'vue-demi';
import { IS_COMPOSITION_VERSION, provideKey, ProvideValue, CommonMethod, defineProvideValue } from '../constant';
import { wrapperProps } from './props';

/** 外部需传递的 props */
export type WrapperProps = ExtractPropTypes<typeof wrapperProps>;
/** 外部传递的方法 */
export type WrapperOption = {
    /** 触发搜索事件 */
    search?: (params: Record<string, any>) => void;
    /** 触发重置事件 */
    reset?: (params: Record<string, any>) => void;
    /**
     * 字段值发生改变时触发
     * @param {object} option 提供的
     * @param {string} option.field 实际改变的键
     * @param {*} option.value
     * @param {object} option.query
     * @param {string} option.nativeField 原始健(不受 as, fields 等属性影响)
     */
    fieldChange?: (option: { field: string; value: any; query: Record<string, any>; nativeField: string }) => void;
};

/** 封装 wrapper 组件必备的信息 */
export function useWrapper(props: WrapperProps, option?: WrapperOption) {
    const child: CommonMethod[] = [];
    onBeforeUnmount(() => child.splice(0));
    const emptyValue = computed(() => props.emptyValue?.());

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
    /** 记录所有条件的 options */
    const optionsObj = reactive<Record<string, any>>({});
    /** 提供给子条件组件的方法 */
    const wrapperInstance = defineProvideValue({
        realtime: toRef(props, 'realtime', false),
        queryChangedInWrapper: ref(false),
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
        updateQueryValue(field, value, nativeField) {
            props.emptyValues.includes(value) && value !== emptyValue.value && (value = emptyValue.value);
            if (isLogField) logFields.push(field);
            set(query.value, field, value);
            changedQueryObj[field] = value;
            option?.fieldChange?.({ field, value, query: query.value, nativeField });
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
        options: optionsObj,
    });
    provide<ProvideValue>(provideKey, wrapperInstance);

    /** 内部条件最新的值, 在没触发搜索按钮前, 不会同步到外部 */
    const query = ref<Record<string, string>>({ ...props.backfill });
    // 由于 watch 主动处理了 backfill
    // 所以覆盖就没有存在的必要了
    // const getQuery = () => ({ ...query.value, ...props.backfill, ...changedQueryObj });
    const getQuery = () => ({ ...query.value });
    watch(
        () => ({ ...props.backfill }),
        (val, oldVal) => {
            wrapperInstance.queryChangedInWrapper.value = true;
            // 手动处理 query 的值于 backfill 保持一致
            // 防止 query.value 对象改变导致内部监听误触发
            Object.keys(query.value).forEach((k) => {
                val?.hasOwnProperty(k) || delete query.value[k];
            });
            // #fix 只合并有变化的字段, 防止子级 watch 监听时误触发
            const newQuery = {} as Record<string, any>;
            let isChanged = false;
            Object.keys(val).forEach((k) => {
                if (val[k] !== oldVal[k]) {
                    newQuery[k] = val[k];
                    isChanged = true;
                }
            });
            isChanged && Object.assign(query.value, newQuery);
            isChanged ? nextTick(restoreQueryChanged) : restoreQueryChanged();
        },
        { deep: true },
    );
    function restoreQueryChanged() {
        wrapperInstance.queryChangedInWrapper.value = false;
    }

    async function search() {
        const msg = await validate();
        msg ? props.toast?.(msg) : option?.search?.(getQuery());
    }
    /** 重置所有条件的值 */
    function reset() {
        child.forEach((v) => {
            v.reset();
            v.updateWrapperQuery();
        });
        option?.reset?.(getQuery());
    }
    /**
     * 重置为默认值
     * @param {boolean} [allowEmptyValue] 当默认值为空值时, 是否允许重置为空值
     */
    function resetField(allowEmptyValue?: boolean) {
        child.forEach((v) => {
            v.resetField(allowEmptyValue) && v.updateWrapperQuery();
        });
        option?.search?.(getQuery());
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
        resetField,
        validate,
    };
}

import { computed, ExtractPropTypes, inject, onBeforeUnmount, PropType, ref, watch, nextTick } from 'vue-demi';
import { clone, emptyToValue, isEqualExcludeEmptyValue, isEmptyValue, getChained } from '../../utils/index';
import { defineCommonMethod, provideKey, ProvideValue } from '../constant';
import { useDisplay, useDisableInCurrentCycle, useInitialValue } from '../assist';
import { treeProps } from './props';

/** 选中值类型 */
type ValueType = string | number | boolean | Record<string, any>;
/** 外部需传递的 props */
export type TreeProps = ExtractPropTypes<typeof treeProps>;

/**
 * @file 目前该组件尚未被使用
 */

/** 封装 tree 组件必备的信息 */
export function useTree(props: TreeProps) {
    /** 容器注入值 */
    const wrapper = inject<ProvideValue>(provideKey);
    /** 初始值(重置时回填的值) */
    const initialValue = useInitialValue(props);
    /** 当前选中值 */
    const checked = ref<ValueType[] | ValueType[][]>();
    /** 远程获取的数据源 */
    const remoteOption = ref<Record<string, any>[]>([]);
    /** 渲染的数据源(远程数据源 > 本地数据源) */
    const finalOption = computed(() => (remoteOption.value.length ? remoteOption.value : props.options));
    /** 字段集合 */
    const fieldObj = computed(() =>
        props.fields
            ? props.fields.reduce((p, v) => ((p[v] = props.emptyValue), p), {} as Record<string, any>)
            : { [props.field]: props.emptyValue },
    );
    /** 获取当前条件所拥有的值 */
    const getQuery = () => {
        // 未初始化且不存在默认值时不返回查询值
        if (!sourceIsInit.value && !initialValue.value) return {};
        let _checked: ValueType | ValueType[] | ValueType[][] | undefined = clone(checked.value);
        const { ...result } = fieldObj.value;
        if (props.customGetQuery) return props.customGetQuery(_checked, emptyToValue, props);

        if (!_checked) return result;
        if (!props.emitPath) {
            _checked = props.multiple
                ? (_checked as ValueType[]).map((v) => (v as ValueType[])?.slice(-1)[0])
                : (_checked as ValueType[]).slice(-1)[0];
        }
        if (Array.isArray(_checked)) {
            props.fields
                ? _checked.forEach((o, i) => {
                      result[props.fields![i]] = emptyToValue(o, props.emptyValue);
                  })
                : (result[props.field] = _checked);
        } else {
            result[props.fields?.[0] || props.field] = emptyToValue(_checked, props.emptyValue);
        }
        return result;
    };
    // 防止触发搜索时, query 产生变化内部重复赋值
    const { flag: realtimeFlag, updateFlag: updateRealtimeFlag } = useDisableInCurrentCycle();
    // 防止触发搜索时, `backfill` 产生变化内部重复赋值
    const { flag: backfillFlag, updateFlag: updateBackfillFlag } = useDisableInCurrentCycle();

    /** 需暴露给父级操作 */
    const option = defineCommonMethod({
        reset() {
            updateRealtimeFlag();
            updateBackfillFlag();
            checked.value = (props.resetToInitialValue && initialValue.value?.slice()) || [];
            return this;
        },
        get validator() {
            return props.validator;
        },
        updateWrapperQuery() {
            updateRealtimeFlag();
            wrapper && Object.entries(getQuery()).forEach(([k, v]) => wrapper.updateQueryValue(k, v));
        },
        getQuery,
    });

    wrapper?.register(option);
    const { insetDisabled, insetHide } = useDisplay(props, option);

    const unwatchs: (() => void)[] = [];
    onBeforeUnmount(() => unwatchs.forEach((v) => v()));

    const sourceIsInit = ref(typeof props.getOptions !== 'function' || !!props.fields?.length);
    watch(sourceIsInit, (val) => val && initCheckedInfo(), { immediate: true });
    /** 设置初次选中的值以及初始值 */
    function initCheckedInfo() {
        const { backfill: BACKFILL, field: FIELD, fields: FIELDS } = props;
        if (BACKFILL) {
            // 存在回填值且回填值中对应字段为真
            // 则设置回填值并不处理后续逻辑
            if (FIELDS) {
                const r = FIELDS.reduce((p, v) => {
                    BACKFILL[v] && p.push(BACKFILL[v]);
                    return p;
                }, [] as string[]);
                if (r.length) {
                    checked.value = r;
                    option.updateWrapperQuery();
                    return;
                }
            } else if (BACKFILL[FIELD]) {
                checked.value = insideGetChained(BACKFILL[FIELD]);
                option.updateWrapperQuery();
                return;
            }
        }
        // 不存在回填值, 看是否存在初始值
        // 存在设置默认值
        if (initialValue.value?.length) {
            // TODO 需考虑 emitPath 和多选的情况
            // 此种情况比较多 可封装成一个函数处理
            checked.value =
                typeof initialValue.value === 'string'
                    ? insideGetChained(initialValue.value)
                    : initialValue.value.slice();
            typeof initialValue.value === 'string' && (initialValue.value = clone(checked.value));
            option.updateWrapperQuery();
        }
    }

    // 提交字段发生改变时, 删除原有字段并更新最新值
    unwatchs.push(
        watch(
            () => props.fields || [props.field],
            (val, oldVal) => {
                val.toString() !== oldVal.toString() &&
                    wrapper &&
                    oldVal.forEach((o) => val.includes(o) || wrapper.removeUnreferencedField(o));
                option.updateWrapperQuery();
            },
        ),
    );
    // 实时值发生变化时触发更新 - 共享同一个字段
    unwatchs.push(
        watch(
            () =>
                [
                    props.fields?.toString() || props.field,
                    props.fields?.map((v) => props.query[v]).filter(Boolean) || props.query[props.field],
                ] as const,
            ([_field, val], [__field, oldVal]) => {
                // 仅在值发生变化时同步
                if (!realtimeFlag.value) return;
                if (_field !== __field || isEqualExcludeEmptyValue(val, oldVal)) return;
                // TODO 需考虑 emitPath 和多选的情况
                // checked.value = typeof val === 'string' ? insideGetChained(val) : val;
            },
        ),
    );
    // 回填值发生变化时触发更新
    unwatchs.push(
        watch(
            () =>
                props.fields?.length
                    ? props.fields.reduce((p, k) => {
                          props.backfill?.[k] && p.push(props.backfill[k]);
                          return p;
                      }, [] as string[])
                    : props.backfill?.[props.field],
            (value: ValueType | ValueType[], oldVal: ValueType | ValueType[]) => {
                if (!sourceIsInit.value) return;
                if (isEqualExcludeEmptyValue(value, oldVal)) return;
                updateBackfillFlag();
                // TODO 判断最后一个值是否与选中项最后一个一致(多选需遍历)
                // 如果一致则不更新, 不一致, 则通过 insideGetChained 获取到树形再赋值
                // updateCheckedValue(value);
            },
        ),
    );
    // 存在依赖项
    unwatchs.push(
        watch(
            () =>
                [
                    props.depend,
                    props.dependFields,
                    props.dependFields && ([] as string[]).concat(props.dependFields).map((k) => props.query?.[k]),
                ] as const,
            ([_depend, _dependFields, val], [__depend, __dependFields, oldVal]) => {
                if (!backfillFlag.value) return;
                if (isEqualExcludeEmptyValue(val, oldVal)) return;
                getOption('depend');
                // 更新依赖条件时不做改动
                if (_depend !== __depend || _dependFields?.toString() !== __dependFields?.toString()) return;
                updateCheckedValue(undefined);
            },
        ),
    );
    unwatchs.push(watch(() => props.getOptions, getOption.bind(null, 'initial'), { immediate: true }));

    /** 获取数据源发生变化事件 */
    function getOption(trigger: 'initial' | 'depend') {
        props.getOptions?.(
            (data) => {
                remoteOption.value = data || [];
                sourceIsInit.value = true;
            },
            props.query || {},
            {
                trigger,
                change: (value: any, isInitial?: boolean) => {
                    isInitial && (initialValue.value = value);
                    change(value);
                },
                search: (value: any, isInitial?: boolean) => {
                    isInitial && (initialValue.value = value);
                    updateCheckedValue(value);
                    wrapper?.search();
                },
            },
        );
    }
    /**
     * 更新选中值(父级也同步更改)
     * @param {ValueType | ValueType[]} values 待更改的值
     */
    function updateCheckedValue(values?: ValueType[] | ValueType[][]) {
        if (isEqualExcludeEmptyValue(checked.value, values)) return;
        checked.value = values;
        option.updateWrapperQuery();
    }
    /**
     * change 事件
     * @param {Array} values 待更改的值
     */
    function change(values?: ValueType[] | ValueType[][]) {
        updateCheckedValue(values);
        wrapper?.insetSearch();
    }
    /**
     * 根据提供的值获取其祖先(包括自身)
     */
    function insideGetChained(val: ValueType) {
        if (isEmptyValue(val)) return [];
        const { valueKey, childrenKey } = props;
        return getChained(finalOption.value, (item) => item[valueKey] === val)
            .map((v) => v[valueKey], childrenKey)
            .filter(Boolean);
    }

    return {
        wrapper,
        option,
        checked,
        getQuery,
        finalOption,
        insetDisabled,
        insetHide,
        change,
        reset: option.reset,
    };
}

import type { ExtractPropTypes } from 'vue-demi';
import {
    computed,
    inject,
    nextTick,
    onBeforeUnmount,
    PropType,
    ref,
    shallowRef,
    toRaw,
    watch,
    watchEffect,
} from 'vue-demi';
import { clone, emptyToValue, get, getChained, isEmptyValue, isEqualExcludeEmptyValue } from '../../utils/index';
import { useDisableInCurrentCycle, useDisplay, useInitialValue } from '../assist';
import type { ProvideValue } from '../constant';
import { CommonMethod, defineCommonMethod, provideKey } from '../constant';
import type { plainProps } from './props';

/** 外部需传递的 props */
export type PlainProps = ExtractPropTypes<typeof plainProps>;

type ValueType = string | number | boolean | null | undefined | Record<string, any>;

/** 封装扁平组件必备的信息 */
export function usePlain(props: PlainProps) {
    const unwatchs: (() => void)[] = [];
    /** 容器注入值 */
    const wrapper = inject<ProvideValue>(provideKey);
    /** 初始值(重置时回填的值) */
    const initialValue = useInitialValue(props);
    /** 初始是否存在回填值 */
    const initialBackfillValue = props.fields?.length
        // 防止回填值不存在时产生一个空数组(undefined[])
        ? props.fields.map((key) => props.query[key]).filter(Boolean) as ValueType[]
        : props.query[props.field] as ValueType;
    /** 当前选中值 */
    const checked = ref<ValueType | ValueType[]>(
        initialBackfillValue || (props.defaultValue !== undefined ? clone(initialValue.value) : undefined),
    );
    /** 远程获取的数据源 */
    const remoteOption = ref<Record<string, any>[]>([]);
    /** 渲染的数据源(远程数据源 > 本地数据源) */
    const finalOption = computed(() => (remoteOption.value.length ? remoteOption.value : props.options));
    unwatchs.push(
        watch(finalOption, (value) => wrapper && (wrapper.options[props.field] = value), { immediate: true }),
    );
    const getQuery = () => {
        if (props.customGetQuery) return props.customGetQuery(checked.value, emptyToValue, props);
        const _checked = clone(checked.value);
        return props.multiple && props.fields
            ? props.fields.reduce(
                    // eslint-disable-next-line no-sequences
                    (p, k, i) => ((p[k] = emptyToValue((_checked as ValueType[])?.[i], props.emptyValue)), p),
                    {} as Record<string, any>,
                )
            : { [props.field]: emptyToValue(_checked, props.emptyValue) };
    };

    const option = defineCommonMethod({
        reset(this: void) {
            const { multiple } = props;
            checked.value = (props.resetToInitialValue && clone(initialValue.value)) || (multiple ? [] : '');
        },
        resetField(this: void, allowEmptyValue?: boolean) {
            const r = clone(initialValue.value);
            const isEmpty = isEmptyValue(r);
            allowEmptyValue ? (checked.value = r || props.multiple ? [] : '') : isEmpty || (checked.value = r);
            return !!allowEmptyValue || !isEmpty;
        },
        updateWrapperQuery(this: void) {
            wrapper && Object.entries(getQuery()).forEach(([k, v]) => wrapper.updateQueryValue(k, v, props.field));
        },
        get validator() {
            return props.validator;
        },
        getQuery,
        onChangeByBackfill: () => isSyncedQueryValue = false,
    });

    wrapper?.register(option);
    const { insetDisabled, insetHide } = useDisplay(props, option);
    /** 不存在回填值且存在默认值时更新父级中的值 */
    if (initialBackfillValue === undefined && props.defaultValue !== undefined) {
        option.updateWrapperQuery();
    }

    onBeforeUnmount(() => unwatchs.forEach((v) => v()));

    // 提交字段发生改变时, 删除原有字段并更新最新值
    unwatchs.push(
        watch(
            () => props.field,
            (val, oldVal) => {
                val !== oldVal && wrapper?.removeUnreferencedField(oldVal);
                option.updateWrapperQuery();
            },
        ),
    );
    /**
     * checked.value 是否同步了 query 的值
     * 在 wrapper.backfill 中批量更新值时, 禁止依赖做处理
     */
    let isSyncedQueryValue = false;
    // 实时值发生变化时触发更新 - 共享同一个字段
    unwatchs.push(
        watch(
            [
                () => props.fields || props.field,
                () =>
                    props.fields ? props.fields.map((k) => props.query[k]).filter(Boolean) : props.query[props.field],
            ],
            ([_field, val], [__field]) => {
                const _val = props.backfillToValue(val, _field, props.query);
                if (
                    checked.value === _val
                    || _field.toString() !== __field.toString()
                    || isEqualExcludeEmptyValue(_val, checked.value)
                ) {
                    return;
                }
                // 实时值改变先判断值是否为空
                // 为空时, 存在初始值且允许重置为初始值时, 用初始值替代, 且通知上层组件
                // 否则直接更新值即可
                if (checked.value !== _val) {
                    isSyncedQueryValue = true;
                    isEmptyValue(_val) && props.resetToInitialValue && !isEmptyValue(initialValue.value)
                        ? change(_val)
                        : (checked.value = _val);
                }
            },
            { flush: 'sync' },
        ),
    );

    /** 是否允许依赖变动时, 重置值(外部通过 search, change 主动改变值时, 内部应取消重置) */
    const { flag: allowDependChangeValue, updateFlag: updateAllowDependChangeValue } = useDisableInCurrentCycle(true);
    // 存在依赖项
    unwatchs.push(
        watch(
            [
                () => props.depend,
                () => props.dependFields,
                () => props.dependFields && ([] as string[]).concat(props.dependFields).map((k) => get(props.query, k)),
            ],
            ([_depend, _dependFields], [__depend, __dependFields]) => {
                // 是否启用依赖, 相同时启用才走后续逻辑, 不同时直接走后续逻辑
                if (_depend === __depend && !_depend) return;
                getOption('depend');
                // 类空值时, 不触发 change 事件
                // 防止表单类监测值发生改变时触发校验
                // 或内部不允许重置时直接返回
                const isNeedReset = typeof props.resetByDependValueChange === 'boolean' ? props.resetByDependValueChange : props.resetByDependValueChange(props.query);
                if (isSyncedQueryValue || !isNeedReset || isEmptyValue(checked.value) || !allowDependChangeValue.value) return;
                change(isEmptyValue(initialValue.value) ? (props.multiple ? [] : '') : clone(initialValue.value));
            },
            { flush: 'sync', ...props.dependWatchOption },
        ),
    );

    // 存在选项变动依赖项时
    unwatchs.push(
        watch(
            [
                () => props.optionsDepend,
                () =>
                    wrapper
                    && (props.optionsDependFields || props.dependFields)
                    && ([] as string[])
                        .concat(props.optionsDependFields || props.dependFields!)
                        .map((k) => wrapper.options[k]),
            ],
            ([_depend], [__depend]) => {
                // 是否启用依赖, 相同时启用才走后续逻辑, 不同时直接走后续逻辑
                if (_depend === __depend && !_depend) return;
                getOption('depend');
            },
            // 不需要 immediate, 因为 getOption 初始会执行一次
        ),
    );

    // 监听 getOptions 选项
    unwatchs.push(watch(() => props.getOptions, getOption.bind(null, 'initial')));
    nextTick(getOption.bind(null, 'initial'));

    /** 获取数据源发生变化事件 */
    function getOption(trigger: 'initial' | 'depend') {
        props.getOptions?.(
            (data) => {
                const _checked = checked.value;
                // 重置 checked, 防止增加 option 后, select 值没更新的问题
                checked.value = undefined as any;
                remoteOption.value = data || [];
                checked.value = _checked;
            },
            props.query || {},
            {
                trigger,
                options: toRaw(wrapper?.options) || {},
                changeDefaultValue(value: any) {
                    initialValue.value = value;
                    return this;
                },
                change(value: any, isInitial?: boolean) {
                    isInitial && (initialValue.value = value);
                    updateAllowDependChangeValue();
                    change(value);
                    return this;
                },
                search(value: any, isInitial?: boolean) {
                    isInitial && (initialValue.value = value);
                    updateAllowDependChangeValue();
                    updateCheckedValue(value);
                    wrapper?.search();
                    return this;
                },
            },
        );
    }
    /**
     * 更新选中值(父级也同步更改)
     * @param {*} value 待更改的值
     */
    function updateCheckedValue(value: ValueType | ValueType[]) {
        // updateWrapperQuery 必须要执行, 防止在 custom-render 中改变了
        // checked.value 深层次内的值, 由于引用相同导致父级未更新的情况
        if (value !== checked.value) {
            // #fix 先判断值是否为空
            // 为空时, 存在初始值且允许重置为初始值时, 用初始值替代, 且通知上层组件
            // 否则直接更新值即可
            checked.value
                = isEmptyValue(value) && props.resetToInitialValue && !isEmptyValue(initialValue.value)
                    ? clone(initialValue.value)
                    : value;
        }
        option.updateWrapperQuery();
    }
    /**
     * 更新选中值并触发内部搜索事件
     * @param {*} value 待更改的值
     */
    function change(value: ValueType | ValueType[]) {
        updateCheckedValue(value);
        wrapper?.insetSearch();
    }

    return {
        wrapper,
        option,
        checked,
        getQuery,
        insetDisabled,
        insetHide,
        finalOption,
        updateCheckedValue,
        change,
        reset: option.reset,
    };
}

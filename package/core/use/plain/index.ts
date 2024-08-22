import {
    ExtractPropTypes,
    computed,
    inject,
    onBeforeUnmount,
    PropType,
    ref,
    watch,
    watchEffect,
    toRaw,
    shallowRef,
    nextTick,
} from 'vue-demi';
import { clone, emptyToValue, isEqualExcludeEmptyValue, isEmptyValue, getChained, get } from '../../utils/index';
import { CommonMethod, defineCommonMethod, provideKey, ProvideValue } from '../constant';
import { useDisplay, useDisableInCurrentCycle, useInitialValue } from '../assist';
import { plainProps } from './props';

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
    const initialBackfillValue =
        props.query &&
        (props.fields?.length
            ? // 防止回填值不存在时产生一个空数组(undefined[])
              props.fields.map((key) => props.query[key]).filter(Boolean)
            : props.query[props.field]);
    /** 当前选中值 */
    const checked = shallowRef<ValueType | ValueType[]>(
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
                  (p, k, i) => ((p[k] = emptyToValue((_checked as ValueType[])?.[i], props.emptyValue)), p),
                  {} as Record<string, any>,
              )
            : { [props.field]: emptyToValue(_checked, props.emptyValue) };
    };

    const option = defineCommonMethod({
        reset() {
            const { multiple } = props;
            checked.value = (props.resetToInitialValue && initialValue.value?.slice()) || (multiple ? [] : '');
        },
        updateWrapperQuery() {
            wrapper && Object.entries(getQuery()).forEach(([k, v]) => wrapper.updateQueryValue(k, v, props.field));
        },
        get validator() {
            return props.validator;
        },
        getQuery,
    });

    wrapper?.register(option);
    const { insetDisabled, insetHide } = useDisplay(props, option);
    /** 不存在回填值且存在默认值时更新父级中的值 */
    if (!initialBackfillValue && props.defaultValue) {
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
                    checked.value === _val ||
                    _field.toString() !== __field.toString() ||
                    isEqualExcludeEmptyValue(_val, checked.value)
                )
                    return;
                // 实时值改变仅更新值即可, 不做其它任何操作
                checked.value !== _val && (checked.value = _val);
            },
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
                if (isEmptyValue(checked.value) || !allowDependChangeValue.value) return;
                change(props.multiple ? [] : '');
            },
            props.dependWatchOption,
        ),
    );

    // 存在选项变动依赖项时
    unwatchs.push(
        watch(
            [
                () => props.optionsDepend,
                () =>
                    wrapper &&
                    (props.optionsDependFields || props.dependFields) &&
                    ([] as string[])
                        .concat(props.optionsDependFields || props.dependFields!)
                        .map((k) => wrapper!.options[k]),
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
        if (value === checked.value) return;
        checked.value = value;
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

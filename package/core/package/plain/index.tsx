import { computed, defineComponent, inject, onBeforeUnmount, PropType, ref, watch, watchEffect } from 'vue-demi';
import { existsEvent, getEvent, getSlot, VALUE_KEY } from '../../utils/assist';
import { hasOwn, emptyToValue } from '../../utils/index';
import { plainProps } from '../../common/props';
import { selectEmits } from '../../common/emits';
import { CommonMethod, defineCommonMethod, provideKey, ProvideValue } from '../../common/provide';
import { useDisplay, useDisableInCurrentCycle, useInitialValue } from '../../use';

/**
 * @file 普通数据结构组件
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'CorePlain',
    props: plainProps,
    // emits: selectEmits,
    setup(props, ctx) {
        /** 容器注入值 */
        const wrapper = inject<ProvideValue>(provideKey);
        /** 初始值(重置时回填的值) */
        const initialValue = useInitialValue(props);
        /** 初始是否存在回填值 */
        const initialBackfillValue = props.backfill && (props.fields?.length ? props.fields.map((key) => props.backfill![key]) : props.backfill[props.field]);
        /** 当前选中值 */
        const checked = ref<string | string[]>(
            initialBackfillValue ||
                (props.defaultValue !== undefined ? initialValue.value : props.multiple ? [] : '')
                    // 防止数组引用导致默认值发生改变
                    .slice(),
        );
        /** 远程获取的数据源 */
        const remoteOption = ref<Record<string, any>[]>([]);
        /** 渲染的数据源(远程数据源 > 本地数据源) */
        const finalOption = computed(() => (remoteOption.value.length ? remoteOption.value : props.options));
        const getQuery = () => {
            if (props.customGetQuery) return props.customGetQuery(checked.value, emptyToValue, props);
            return props.multiple && props.fields
                ? props.fields.reduce(
                      (p, k, i) => ((p[k] = emptyToValue(checked.value?.[i], props.emptyValue)), p),
                      {} as Record<string, any>,
                  )
                : { [props.field]: emptyToValue(checked.value, props.emptyValue) };
        };
        // 防止触发搜索时, query 产生变化内部重复赋值
        const { flag: realtimeFlag, updateFlag: updateRealtimeFlag } = useDisableInCurrentCycle();
        // 防止触发搜索时, backfill 产生变化内部重复赋值
        const { flag: backfillFlag, updateFlag: updateBackfillFlag } = useDisableInCurrentCycle();

        const option = defineCommonMethod({
            reset() {
                const { multiple } = props;
                updateRealtimeFlag();
                updateBackfillFlag();
                checked.value = (props.resetToInitialValue && initialValue.value?.slice()) || (multiple ? [] : '');
            },
            updateWrapperQuery() {
                updateRealtimeFlag();
                wrapper && Object.entries(getQuery()).forEach(([k, v]) => wrapper.updateQueryValue(k, v));
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

        const unwatchs: (() => void)[] = [];
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
                () =>
                    [
                        props.fields || props.field,
                        props.fields
                            ? props.fields.map((k) => props.query[k]).filter(Boolean)
                            : props.query[props.field],
                    ] as const,
                // [props.field, props.query[props.field]] as const,
                ([_field, val], [__field]) => {
                    const _val = props.backfillToValue(val, _field, props.query);
                    // 仅在值发生变化时同步
                    if (_field.toString() !== __field.toString() || _val?.toString() === checked.value?.toString())
                        return;
                    if (!realtimeFlag.value) return;
                    checked.value = _val;
                },
            ),
        );
        // 回填值发生变化时触发更新
        unwatchs.push(
            watch(
                () =>
                    [
                        props.fields || props.field,
                        props.fields
                            ? props.fields.map((k) => props.backfill?.[k]).filter(Boolean)
                            : props.backfill?.[props.field],
                    ] as const,
                ([_field, val], [__field]) => {
                    // 存在回填值时回填, 不存在时不做改动
                    const _val = props.backfillToValue(val, _field, props.backfill);
                    if (_field.toString() !== __field.toString() || _val?.toString() === checked.value?.toString())
                        return;
                    updateBackfillFlag();
                    updateCheckedValue(_val);
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
                        (props.dependFields &&
                            ([] as string[])
                                .concat(props.dependFields)
                                .map((k) => props.query?.[k])
                                .join(',')) ||
                            '',
                    ] as const,
                ([_depend, _dependFields, val], [__depend, __dependFields, oldVal]) => {
                    if (!backfillFlag.value) return;
                    if (val === oldVal) return;
                    getOption('depend');
                    // 更新依赖条件时不做改动
                    if (_depend !== __depend || _dependFields?.toString() !== __dependFields?.toString()) return;
                    if (checked.value === undefined || checked.value.toString() === '') return;
                    updateCheckedValue(props.multiple ? [] : '');
                },
            ),
        );
        unwatchs.push(watch(() => props.getOptions, getOption.bind(null, 'initial'), { immediate: true }));

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
         * @param {string | string[]} value 待更改的值
         */
        function updateCheckedValue(value: string | string[]) {
            if (value === checked.value) return;
            checked.value = value;
            option.updateWrapperQuery();
        }
        /**
         * 更新选中值并触发内部搜索事件
         * @param {string | string[]} value 待更改的值
         */
        function change(value: string | string[]) {
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
    },
    render() {
        const {
            checked: value,
            getQuery,
            insetDisabled,
            insetHide,
            finalOption: options,
            change,
            reset,

            multiple,
            // clearable,
        } = this;
        if (insetHide) return void 0 as any;
        const defaultSlot = getSlot('default', this);
        // @ts-ignore
        const listeners = hasOwn(this, '$listeners') ? this.$listeners : null;

        return typeof defaultSlot === 'function'
            ? defaultSlot({
                  ...this.$attrs,
                  listeners,
                  [VALUE_KEY]: value,
                  options,
                  disabled: insetDisabled,
                  change,

                  multiple,
                  // clearable,
              })
            : defaultSlot!;
    },
});

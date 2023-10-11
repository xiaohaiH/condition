import { computed, defineComponent, inject, onBeforeUnmount, PropType, ref, watch } from 'vue-demi';
import { existsEvent, getEvent, getSlot, VALUE_KEY } from '../../utils/assist';
import { hasOwn, emptyToValue } from '../../utils/index';
import { selectProps } from '../../common/props';
import { selectEmits } from '../../common/emits';
import { CommonMethod, provideKey, ProvideValue } from '../../common/provide';
import { useDisplay, useDisableInCurrentCycle, useInitialValue } from '../../use';

/**
 * @file 下拉框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'CoreSelect',
    props: selectProps,
    // emits: selectEmits,
    setup(props, ctx) {
        const wrapper = inject<ProvideValue>(provideKey);
        const initialValue = useInitialValue(props);
        const initialBackfillValue = props.backfill && props.backfill[props.field];
        const checked = ref<string | string[]>(
            initialBackfillValue ||
                (props.defaultValue !== undefined ? initialValue.value : props.multiple ? [] : '')
                    // 防止数组引用导致默认值发生改变
                    .slice(),
        );
        const { flag, updateFlag } = useDisableInCurrentCycle();
        const getQuery = () => ({ [props.field]: emptyToValue(checked.value, props.emptyValue) });

        const option: CommonMethod = {
            reset,
            updateWrapperQuery() {
                wrapper?.updateQueryValue(props.field, emptyToValue(checked.value, props.emptyValue));
                return option;
            },
            get validator() {
                return props.validator;
            },
            getQuery,
        };
        wrapper?.register(option);
        const { insetDisabled, insetHide } = useDisplay(props, option);
        /** 不存在回填值且存在默认值时更新父级中的值 */
        if (!initialBackfillValue && props.defaultValue) {
            option.updateWrapperQuery();
        }

        /** 远程获取的数据源 */
        const remoteOption = ref<Record<string, any>[]>([]);
        /** 优先使用远程数据源 */
        const originOption = computed(() => (remoteOption.value.length ? remoteOption.value : props.options));
        /** 是否使用筛选过后的数据 */
        const backFilterOption = ref(false);
        /** 筛选后的数据 */
        const filterOption = ref<Record<string, any>[]>([]);
        // 根据是否过滤返回不同的数据源
        const finalOption = computed(() => {
            return backFilterOption.value ? filterOption.value : originOption.value;
        });
        // 自定义的过滤事件
        const customFilterMethod = computed(() => {
            return props.filterMethod && finalFilterMethod;
        });

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
                () => [props.field, props.query[props.field]] as const,
                ([_field, val], [__field]) => {
                    // 仅在值发生变化时同步
                    if (_field !== __field || val === checked.value) return;
                    checked.value = val;
                },
            ),
        );
        // 回填值发生变化时触发更新
        unwatchs.push(
            watch(
                () => [props.field, props.backfill?.[props.field]] as const,
                ([_field, val], [__field]) => {
                    // 存在回填值时回填, 不存在时不做改动
                    if (_field !== __field && !props.backfill?.hasOwnProperty(_field)) return;
                    updateFlag();
                    updateCheckedValue(val);
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
                    if (!flag.value) return;
                    if (checked.value === undefined || checked.value.toString() === '') return;
                    // 更新依赖条件时不做改动
                    if (_depend !== __depend || _dependFields?.toString() !== __dependFields?.toString()) return;
                    if (val === oldVal) return;
                    updateCheckedValue(props.multiple ? [] : '');
                    getOption('depend');
                },
            ),
        );
        unwatchs.push(watch(() => props.getOptions, getOption.bind(null, 'initial'), { immediate: true }));

        /** 失焦事件 */
        function blur() {
            // const blurHandler = getEvent(ctx, 'blur');
            // blurHandler?.(...arguments);
            props.filterMethod && finalFilterMethod('');
        }
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
        /** 过滤方法 */
        function finalFilterMethod(value: string) {
            const { filterMethod } = props;
            if (value === '' || value === undefined) {
                backFilterOption.value = false;
                filterOption.value = [];
            } else {
                backFilterOption.value = true;
                filterOption.value = originOption.value.filter((v) => filterMethod!(value, v));
            }
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
         * select change 事件
         * @param {string | string[]} value 待更改的值
         */
        function change(value: string | string[]) {
            updateCheckedValue(value);
            wrapper?.insetSearch();
        }
        /**
         * 重置数据
         */
        function reset() {
            const { multiple } = props;
            updateFlag();
            checked.value = (props.resetToInitialValue && initialValue.value?.slice()) || (multiple ? [] : '');
            return option;
        }

        return {
            checked,
            getQuery,
            insetDisabled,
            insetHide,
            finalOption,
            customFilterMethod,
            blur,
            updateCheckedValue,
            change,
            reset,
        };
    },
    render() {
        const {
            checked: value,
            getQuery,
            insetDisabled,
            insetHide,
            finalOption: options,
            blur,
            customFilterMethod: filterMethod,
            change,
            reset,

            valueKey,
            labelKey,
            multiple,
            // clearable,
        } = this;
        if (insetHide) return void 0 as any;
        const defaultSlot = getSlot('default', this);
        // @ts-ignore
        const listeners = hasOwn(this, '$listeners') ? { ...this.$listeners } : null;
        // listeners && delete listeners.blur;

        return typeof defaultSlot === 'function'
            ? defaultSlot({
                  ...this.$attrs,
                  listeners,
                  [VALUE_KEY]: value,
                  options,
                  disabled: insetDisabled,
                  blur,
                  filterMethod,
                  change,

                  valueKey,
                  labelKey,
                  multiple,
                  // clearable,
              })
            : defaultSlot!;
    },
});

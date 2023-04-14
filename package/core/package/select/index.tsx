import { computed, defineComponent, inject, onBeforeUnmount, PropType, ref, watch } from 'vue-demi';
import { existsEvent, getEvent, getSlot } from '../../utils/assist';
import { hasOwn, emptyToValue } from '../../utils/index';
import { selectProps } from '../../common/props';
import { selectEmits } from '../../common/emits';
import { CommonMethod, provideKey, ProvideValue } from '../../common/provide';
import { useDisplay, useDisableInCurrentCycle } from '../../use';

/**
 * @file 下拉框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'CoreSelect',
    props: selectProps,
    // emits: selectEmits,
    setup(props, ctx) {
        const { field: FIELD, depend: DEPEND, dependFields: DEPEND_FIELDS } = props;
        const wrapper = inject<ProvideValue>(provideKey);
        const checked = ref<string | string[]>(props.multiple ? [] : '');
        const { flag, updateFlag } = useDisableInCurrentCycle();
        const getQuery = () => ({ [props.field]: emptyToValue(checked.value, props.emptyValue) });
        const initialValue = props.backfill?.[FIELD] || checked.value;

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

        const unwatchs: (() => void)[] = [];
        onBeforeUnmount(() => unwatchs.forEach((v) => v()));

        // 回填值发生变化时触发更新
        unwatchs.push(
            watch(
                () => props.backfill?.[FIELD],
                (val: string | string[]) => {
                    updateFlag();
                    updateCheckedValue(val);
                },
                { immediate: true, deep: true },
            ),
        );
        unwatchs.push(watch(() => props.getOptions, getOption, { immediate: true }));
        if (DEPEND && DEPEND_FIELDS && DEPEND_FIELDS.length) {
            // 存在依赖项
            unwatchs.push(
                watch(
                    () =>
                        ([] as string[])
                            .concat(DEPEND_FIELDS)
                            .map((k) => props.query?.[k])
                            .join(','),
                    (val, oldVal) => {
                        if (!flag.value) return;
                        if (val === oldVal) return;
                        updateCheckedValue(props.multiple ? [] : '');
                        getOption();
                    },
                ),
            );
        }

        /**
         * 失焦事件
         */
        function blur() {
            // const blurHandler = getEvent(ctx, 'blur');
            // blurHandler?.(...arguments);
            props.filterMethod && finalFilterMethod('');
        }
        /**
         * 获取数据源发生变化事件
         */
        function getOption() {
            props.getOptions?.((data) => {
                const _checked = checked.value;
                // 重置 checked, 防止增加 option 后, select 值没更新的问题
                checked.value = undefined as any;
                remoteOption.value = data || [];
                checked.value = _checked;
            }, props.query || {});
        }
        /**
         * 过滤方法
         */
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
            checked.value = props.resetToInitialValue ? initialValue : multiple ? [] : '';
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
        const listeners = hasOwn(this, '$listeners') ? { ...this.$listeners } : null;
        // listeners && delete listeners.blur;

        return typeof defaultSlot === 'function'
            ? defaultSlot({
                  ...this.$attrs,
                  listeners,
                  value,
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

import { computed, defineComponent, inject, onBeforeUnmount, PropType, ref, watch } from 'vue-demi';
import { existsEvent, getEvent, getSlot } from '../../utils/assist';
import { hasOwn, emptyToValue } from '../../utils/index';
import { selectProps } from '../../common/props';
import { selectEmits } from '../../common/emits';
import { CommonMethod, provideKey, ProvideValue } from '../../common/provide';
import { useDisplay } from '../../use';

/**
 * @file 下拉框
 * TODO: 修复下拉框 blur 事件重复的问题
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'CoreSelect',
    props: selectProps,
    emits: selectEmits,
    setup(props, ctx) {
        const { field, depend, dependFields } = props;
        const wrapper = inject<ProvideValue>(provideKey);
        const checked = ref<string | string[]>(props.multiple ? [] : '');
        const getQuery = () => ({ [props.field]: emptyToValue(checked.value, props.emptyValue) });
        const initialValue = props.backfill?.[field] || checked.value;

        /** 远程获取的数据源 */
        const remoteOption = ref<Record<string, any>[]>([]);
        /** 优先使用远程数据源 */
        const originOption = computed(() => (remoteOption.value.length ? remoteOption.value : props.option));
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
                wrapper?.updateQueryValue(field, emptyToValue(checked.value, props.emptyValue));
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
        unwatchs.push(watch(() => props.backfill?.[field], change, { immediate: true, deep: true }));
        unwatchs.push(watch(() => props.getDict, getOption, { immediate: true }));
        if (depend && dependFields && dependFields.length) {
            // 存在依赖项
            unwatchs.push(
                watch(
                    () =>
                        ([] as string[])
                            .concat(dependFields)
                            .map((k) => props.query?.[k])
                            .join(','),
                    (val, oldVal) => {
                        if (val === oldVal) return;
                        checked.value = props.multiple ? [] : '';
                        option.updateWrapperQuery();
                        getOption();
                    },
                    { deep: true, immediate: true },
                ),
            );
        }

        /**
         * 失焦事件
         */
        function blur() {
            const blurHandler = getEvent(ctx, 'blur');
            blurHandler?.(...arguments);
            props.filterMethod && finalFilterMethod('');
        }
        /**
         * 获取数据源发生变化事件
         */
        function getOption() {
            props.getDict?.((data) => {
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
         * select change 事件
         * @param {String} value: 输入值
         */
        function change(value: string | string[]) {
            checked.value = value;
            option.updateWrapperQuery();
            wrapper?.insetSearch();
        }
        /**
         * 重置数据
         */
        function reset() {
            const { multiple } = props;
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
            clearable,
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
                  clearable,
              })
            : defaultSlot!;
    },
});

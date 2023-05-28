import { computed, defineComponent, inject, onBeforeUnmount, PropType, ref, watch } from 'vue-demi';
import { existsEvent, getSlot, VALUE_KEY } from '../../utils/assist';
import { hasOwn, emptyToValue } from '../../utils/index';
import { datepickerProps } from '../../common/props';
import { datepickerEmits } from '../../common/emits';
import { CommonMethod, provideKey, ProvideValue } from '../../common/provide';
import { useDisplay, useDisableInCurrentCycle } from '../../use';

/**
 * @file 日期
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'CoreDatepicker',
    props: datepickerProps,
    // emits: datepickerEmits,
    setup(props, ctx) {
        const {
            field: FIELD,
            range: RANGE,
            beginField: BEGIN_FIELD,
            endField: END_FIELD,
            depend: DEPEND,
            dependFields: DEPEND_FIELDS,
        } = props;
        const wrapper = inject<ProvideValue>(provideKey);
        const checked = ref<string | string[]>(RANGE && BEGIN_FIELD && END_FIELD ? ['', ''] : '');
        const { flag, updateFlag } = useDisableInCurrentCycle();
        const getQuery = () =>
            props.range && props.beginField && props.endField
                ? {
                      [props.beginField]: emptyToValue(checked.value[0], props.emptyValue),
                      [props.endField]: emptyToValue(checked.value[1], props.emptyValue),
                  }
                : {
                      [props.field]: Array.isArray(checked.value)
                          ? [...checked.value]
                          : emptyToValue(checked.value, props.emptyValue),
                  };
        const initialValue =
            (RANGE && BEGIN_FIELD && END_FIELD
                ? [props.backfill?.[BEGIN_FIELD] || '', props.backfill?.[END_FIELD] || '']
                : props.backfill?.[FIELD]) || '';

        const option: CommonMethod = {
            reset,
            updateWrapperQuery() {
                const { range, field, beginField, endField } = props;
                if (range && beginField && endField) {
                    wrapper?.updateQueryValue(beginField, emptyToValue(checked.value[0], props.emptyValue));
                    wrapper?.updateQueryValue(endField, emptyToValue(checked.value[1], props.emptyValue));
                } else {
                    wrapper?.updateQueryValue(field, emptyToValue(checked.value, props.emptyValue));
                }
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
        if (RANGE && BEGIN_FIELD && END_FIELD) {
            unwatchs.push(
                watch(
                    () => props.backfill?.[BEGIN_FIELD],
                    (value) => {
                        updateFlag();
                        typeof checked.value === 'string' && (checked.value = []);
                        checked.value.splice(0, 1);
                        value && checked.value.splice(0, 0, value);
                        option.updateWrapperQuery();
                    },
                    { immediate: true },
                ),
            );
            unwatchs.push(
                watch(
                    () => props.backfill?.[END_FIELD],
                    (value) => {
                        updateFlag();
                        typeof checked.value === 'string' && (checked.value = []);
                        checked.value.splice(1, 1);
                        value && checked.value.splice(1, 0, value);
                        option.updateWrapperQuery();
                    },
                    { immediate: true },
                ),
            );
        } else {
            unwatchs.push(
                watch(
                    () => props.backfill?.[FIELD],
                    (value) => {
                        updateFlag();
                        checked.value = emptyToValue(value, props.emptyValue);
                        option.updateWrapperQuery();
                    },
                    { immediate: true, deep: true },
                ),
            );
        }
        // 存在依赖项
        if (DEPEND && DEPEND_FIELDS && DEPEND_FIELDS.length) {
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
                        updateCheckedValue(null);
                    },
                ),
            );
        }

        /**
         * 日期更新事件
         * @param {String|Array} value: 更新的日期
         */
        function updateCheckedValue(value: null | string | string[]) {
            const { range } = props;
            checked.value = value === null ? (range ? ['', ''] : '') : value;
            option.updateWrapperQuery();
        }
        /**
         * change 事件
         */
        function change(value: string | string[]) {
            updateCheckedValue(value);
            wrapper?.insetSearch();
        }
        /**
         * 重置数据
         */
        function reset() {
            const { range } = props;
            updateFlag();
            checked.value = props.resetToInitialValue ? initialValue : range ? ['', ''] : '';
            return option;
        }

        return {
            checked,
            getQuery,
            insetDisabled,
            insetHide,
            updateCheckedValue,
            change,
            reset,
        };
    },
    render() {
        const { checked: value, getQuery, insetHide, insetDisabled, updateCheckedValue, change, reset } = this;
        if (insetHide) return void 0 as any;
        const defaultSlot = getSlot('default', this);
        // @ts-ignore
        const listeners = hasOwn(this, '$listeners') ? this.$listeners : null;

        return typeof defaultSlot === 'function'
            ? defaultSlot({
                  ...this.$attrs,
                  listeners,
                  [VALUE_KEY]: value,
                  disabled: insetDisabled,
                  updateCheckedValue,
                  change,
              })
            : defaultSlot!;
    },
});

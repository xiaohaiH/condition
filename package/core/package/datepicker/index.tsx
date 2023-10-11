import { computed, defineComponent, inject, onBeforeUnmount, PropType, ref, watch } from 'vue-demi';
import { existsEvent, getSlot, VALUE_KEY } from '../../utils/assist';
import { hasOwn, emptyToValue } from '../../utils/index';
import { datepickerProps } from '../../common/props';
import { datepickerEmits } from '../../common/emits';
import { CommonMethod, provideKey, ProvideValue } from '../../common/provide';
import { useDisplay, useDisableInCurrentCycle, useInitialValue } from '../../use';

/**
 * @file 日期
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'CoreDatepicker',
    props: datepickerProps,
    // emits: datepickerEmits,
    setup(props, ctx) {
        const wrapper = inject<ProvideValue>(provideKey);
        const initialValue = useInitialValue(props);
        const initialBackfillValue =
            props.backfill &&
            (props.range && props.beginField && props.endField ? ['', ''] : props.backfill[props.field]);
        const initialBackfillValueStr =
            initialBackfillValue &&
            (typeof initialBackfillValue === 'string' ? initialBackfillValue : initialBackfillValue.join(''));
        const checked = ref<string | string[]>(
            ((initialBackfillValueStr && initialBackfillValue) || initialValue.value || initialBackfillValueStr || '')
                // 防止数组引用导致默认值发生改变
                .slice(),
        );
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
        /** 不存在回填值且存在默认值时更新父级中的值 */
        if (!initialBackfillValueStr && props.defaultValue) {
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
                    props.range && props.beginField && props.endField
                        ? ([
                              true,
                              [props.beginField, props.query[props.beginField]],
                              [props.endField, props.query[props.endField]],
                          ] as const)
                        : ([false, [props.field, props.query[props.field]]] as const),
                ([_range, ..._fields], [__range, ...__fields]) => {
                    // 仅在值发生变化时同步
                    if (_fields.some((o, i) => o[0] !== __fields[i][0])) return;
                    if (_range) {
                        // 多个日期
                        typeof checked.value === 'string' && (checked.value = []);
                        _fields.forEach((o, i) => {
                            checked.value[i] !== o[1] &&
                                o[1] !== __fields[i][1] &&
                                ((checked.value as string[])[i] = o[1] || '');
                        });
                    } else {
                        // 单个日期
                        checked.value !== _fields[0][1] &&
                            _fields[0][1] !== __fields[0][1] &&
                            (checked.value = _fields[0][1] || '');
                    }
                },
            ),
        );
        // 回填值发生变化时触发更新
        unwatchs.push(
            watch(
                () =>
                    props.range && props.beginField && props.endField
                        ? ([true, props.backfill?.[props.beginField], props.backfill?.[props.endField]] as const)
                        : ([false, props.backfill?.[props.field]] as const),
                ([_range, ..._values], [__range, ...__values]) => {
                    // if (_range !== __range) return;
                    // 多个日期
                    if (_range) {
                        let change = false;
                        _values.forEach((o, idx) => {
                            if (o === __values[idx]) return;
                            updateFlag();
                            typeof checked.value === 'string' && (checked.value = []);
                            checked.value.splice(idx, 1);
                            o && checked.value.splice(idx, 0, o);
                            change = true;
                        });
                        change && option.updateWrapperQuery();
                    } else {
                        // 单个日期
                        if (_values[0] === __values[0]) return;
                        updateFlag();
                        checked.value = emptyToValue(_values[0], props.emptyValue);
                        option.updateWrapperQuery();
                    }
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
                    // 更新依赖条件时不做改动
                    if (_depend !== __depend || _dependFields?.toString() !== __dependFields?.toString()) return;
                    if (val === oldVal) return;
                    updateCheckedValue(null);
                },
            ),
        );

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
            checked.value = (props.resetToInitialValue && initialValue.value?.slice()) || (range ? ['', ''] : '');
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

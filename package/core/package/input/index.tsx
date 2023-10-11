import { computed, defineComponent, inject, onBeforeUnmount, PropType, ref, watch, isVue2 } from 'vue-demi';
import { hasOwn, emptyToValue } from '../../utils/index';
import { existsEvent, getSlot, VALUE_KEY } from '../../utils/assist';
import { inputProps } from '../../common/props';
// import { inputEmits } from '../../common/emits';
import { CommonMethod, provideKey, ProvideValue } from '../../common/provide';
import { useDisplay, useDisableInCurrentCycle, useInitialValue } from '../../use';

/**
 * @file 输入框
 */
export default defineComponent({
    // inheritAttrs: false,
    name: 'CoreInput',
    props: inputProps,
    // emits: inputEmits,
    setup(props, ctx) {
        const wrapper = inject<ProvideValue>(provideKey);
        const initialValue = useInitialValue(props);
        const initialBackfillValue = props.backfill && props.backfill[props.field];
        const checked = ref<string>(initialBackfillValue || initialValue.value || '');
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
                    if (val === checked.value) return;
                    updateFlag();
                    checked.value = val;
                    option.updateWrapperQuery();
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
                    if (checked.value === '') return;
                    // 更新依赖条件时不做改动
                    if (_depend !== __depend || _dependFields?.toString() !== __dependFields?.toString()) return;
                    if (val === oldVal) return;
                    checked.value = '';
                    option.updateWrapperQuery();
                },
            ),
        );

        // /**
        //  * 实时(直接触发 change 事件), 非实时(延时触发 change 事件)
        //  */
        // function autoApplyChange(value: string) {

        // }
        /**
         * debounce change 事件
         * @param {String} value: 输入值
         */
        let timer = 0;
        function debounceChange(value: string) {
            const { realtime, waitTime } = props;
            checked.value = value;
            timer && clearTimeout(timer);
            // 外部组件非实时的情况下, 延时触发会导致延迟时间内触发搜索按钮时
            // 值不是最新的, 因为容易存在搜索按钮时, 立即触发
            realtime || !wrapper?.realtime.value
                ? (option.updateWrapperQuery(), wrapper?.insetSearch())
                : (timer = setTimeout(
                      () => (option.updateWrapperQuery(), wrapper?.insetSearch()),
                      waitTime,
                  ) as unknown as number);
        }
        /**
         * input enter 事件
         * @param {KeyboardEvent} ev
         */
        function enterHandler(ev: KeyboardEvent | string) {
            checked.value = typeof ev === 'string' ? ev : (ev.target as any)?.value || '';
            option.updateWrapperQuery();
            wrapper?.search();
        }
        /**
         * 重置数据
         */
        function reset() {
            updateFlag();
            checked.value = (props.resetToInitialValue && initialValue.value) || '';
            return option;
        }

        return {
            checked,
            getQuery,
            insetDisabled,
            insetHide,
            debounceChange,
            enterHandler,
            reset,
        };
    },
    render() {
        const { query, checked: value, getQuery, insetDisabled, insetHide, debounceChange, enterHandler, reset } = this;
        if (insetHide) return void 0 as any;
        const defaultSlot = getSlot('default', this);
        // @ts-ignore
        const listeners = hasOwn(this, '$listeners') ? this.$listeners : null;

        return typeof defaultSlot === 'function'
            ? // @ts-ignore
              defaultSlot({
                  ...this.$attrs,
                  listeners,
                  [VALUE_KEY]: value,
                  disabled: insetDisabled,
                  debounceChange,
                  enterHandler,
              })
            : defaultSlot!;
    },
});

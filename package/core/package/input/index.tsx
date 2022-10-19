import { computed, defineComponent, inject, onBeforeUnmount, PropType, ref, watch } from 'vue-demi';
import { hasOwn, emptyToValue } from '../../utils/index';
import { existsEvent, getSlot } from '../../utils/assist';
import { inputProps } from '../../common/props';
// import { inputEmits } from '../../common/emits';
import { CommonMethod, provideKey, ProvideValue } from '../../common/provide';
import { useDisplay } from '../../use';

/**
 * @file 输入框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'CoreInput',
    props: inputProps,
    // emits: inputEmits,
    setup(props, ctx) {
        const { field: FIELD } = props;
        const wrapper = inject<ProvideValue>(provideKey);
        const checked = ref<string>('');
        const getQuery = () => ({ [props.field]: emptyToValue(checked.value, props.emptyValue) });
        const initialValue = props.backfill?.[FIELD] || checked.value;

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
                (val) => {
                    if (val === checked.value) return;
                    checked.value = val;
                    option.updateWrapperQuery();
                },
                { immediate: true, deep: true },
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
            checked.value = props.resetToInitialValue ? initialValue : '';
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
        const listeners = hasOwn(this, '$listeners') ? this.$listeners : null;

        return typeof defaultSlot === 'function'
            ? defaultSlot({
                  ...this.$attrs,
                  listeners,
                  value,
                  disabled: insetDisabled,
                  debounceChange,
                  enterHandler,
              })
            : defaultSlot!;
    },
});

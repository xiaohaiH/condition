import { computed, defineComponent, inject, onBeforeUnmount, PropType, ref, watch } from 'vue-demi';
import { hasOwn } from '../../utils/index';
import { existsEvent, getSlot } from '../../utils/assist';
import { inputProps } from '../../common/props';
// import { inputEmits } from '../../common/emits';
import { CommonMethod, provideKey, ProvideValue } from '../../common/provide';

/**
 * @file 输入框
 * TODO: 开启防抖后, 在防抖结束前进行搜索, 会覆盖最新的值
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'CoreInput',
    props: inputProps,
    // emits: inputEmits,
    setup(props, ctx) {
        const { field } = props;
        const wrapper = inject<ProvideValue>(provideKey);
        const checked = ref<string>('');
        const getQuery = () => ({ [field]: checked.value });

        const option: CommonMethod = {
            reset,
            updateWrapperQuery() {
                wrapper?.updateQueryValue(field, checked.value || '');
                return option;
            },
            get validator() {
                return props.validator;
            },
            getQuery,
        };
        wrapper?.register(option);

        const unwatchs: (() => void)[] = [];
        onBeforeUnmount(() => unwatchs.forEach((v) => v()));

        // 回填值发生变化时触发更新
        unwatchs.push(
            watch(
                () => props.backfill?.[field],
                (val) => {
                    checked.value = val;
                },
                { immediate: true, deep: true },
            ),
        );
        const insetDisabled = ref(typeof props.disabled === 'boolean' ? props.disabled : false);
        const insetHide = ref(typeof props.hide === 'boolean' ? props.hide : false);
        unwatchs.push(
            watch(
                () => props.query,
                () => {
                    if (typeof props.hide === 'function') {
                        insetHide.value = props.hide(props.query);
                        insetHide.value && option.reset().updateWrapperQuery();
                    } else if (typeof props.disabled === 'function') {
                        insetDisabled.value = props.disabled(props.query);
                    }
                },
                { immediate: true, deep: true },
            ),
        );

        /**
         * @description: debounce change 事件
         * @param {String} value: 输入值
         */
        let timer = 0;
        function debounceChange(value: string) {
            const { realtime, waitTimer } = props;
            checked.value = value;
            timer && clearTimeout(timer);
            realtime
                ? wrapper?.updateQueryValueForSearch(field, value)
                : (timer = setTimeout(
                      () => wrapper?.updateQueryValueForSearch(field, value),
                      waitTimer,
                  ) as unknown as number);
        }
        /**
         * @description: input enter 事件
         * @param {KeyboardEvent} ev
         */
        function enterHandler(ev: KeyboardEvent | string) {
            checked.value = typeof ev === 'string' ? ev : (ev.target as any)?.value || '';
            option.updateWrapperQuery();
            wrapper?.search();
        }
        /**
         * @description: 获取返回到上层的值
         */
        function reset() {
            checked.value = '';
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
        const defaultSlot = getSlot('default', this);
        if (insetHide) return void 0 as any;

        return typeof defaultSlot === 'function'
            ? defaultSlot({
                  ...this.$attrs,
                  value,
                  disabled: insetDisabled,
                  debounceChange,
                  enterHandler,
              })
            : defaultSlot!;
    },
});

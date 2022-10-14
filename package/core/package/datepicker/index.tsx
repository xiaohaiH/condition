import { computed, defineComponent, inject, onBeforeUnmount, PropType, ref, watch } from 'vue-demi';
import { existsEvent } from '../../utils/assist';
import { hasOwn } from '../../utils/index';
import { datepickerProps } from '../../common/props';
import { datepickerEmits } from '../../common/emits';
import { CommonMethod, provideKey, ProvideValue } from '../../common/provide';

/**
 * @file 日期
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'CoreDatepicker',
    props: datepickerProps,
    emits: datepickerEmits,
    setup(props, ctx) {
        const wrapper = inject<ProvideValue>(provideKey);
        const checked = ref<string | string[]>(props.range ? ['', ''] : '');
        const option: CommonMethod = {
            reset,
            get validator() {
                return props.validator;
            },
            getQuery,
        };
        wrapper?.register(option);

        const unwatchs: (() => void)[] = [];
        onBeforeUnmount(() => unwatchs.forEach((v) => v()));

        const { range, beginField, endField, field } = props;
        // 回填值发生变化时触发更新
        if (range && beginField && endField) {
            unwatchs.push(
                watch(
                    () => props.backfill?.[beginField],
                    (value) => {
                        typeof checked.value === 'string' && (checked.value = []);
                        checked.value.splice(0, 1, value || '');
                        // 需要通知父级更新 query
                        triggerValue();
                    },
                    { immediate: true },
                ),
            );
            unwatchs.push(
                watch(
                    () => props.backfill?.[endField],
                    (value) => {
                        typeof checked.value === 'string' && (checked.value = []);
                        checked.value.splice(1, 1, value || '');
                    },
                    { immediate: true },
                ),
            );
        } else {
            unwatchs.push(
                watch(
                    () => props.backfill?.[field],
                    (value) => {
                        checked.value = value || '';
                        // 需要通知父级更新 query
                        triggerValue();
                    },
                    { immediate: true, deep: true },
                ),
            );
        }

        // this.innerDisabled = disabledMethod(this);
        // this.innerHide = hideMethod(this);

        /**
         * @description: 日期更新事件
         * @param {String|Array} value: 更新的日期
         */
        function updateChecked(value: string | string[]) {
            const { range } = props;
            checked.value = value === null ? (range ? ['', ''] : '') : value;
        }
        /**
         * @description: change 事件
         */
        function change() {
            triggerValue();
        }
        /**
         * @description: 向上触发改变事件
         */
        function triggerValue() {
            ctx.emit('search', getQuery());
        }
        /**
         * @description: 获取返回到上层的值
         *
         * @return {Object}
         */
        function getQuery() {
            const { range, beginField, endField, field } = props;

            return range && beginField && endField
                ? { [beginField]: checked.value[0] || undefined, [endField]: checked.value[1] || undefined }
                : { [field]: Array.isArray(checked.value) ? [...checked.value] : checked.value || undefined };
        }
        /**
         * @description: 获取返回到上层的值
         */
        function reset() {
            const { range } = props;
            checked.value = range ? ['', ''] : '';
            return option;
        }

        return {
            checked,
            updateChecked,
            change,
            triggerValue,
            getQuery,
            reset,
        };
    },
    render() {
        const { checked: value, updateChecked, change, triggerValue, getQuery, reset } = this;
        // @ts-ignore
        const defaultSlot = (hasOwn(this, '$scopedSlots') && this.$scopedSlots.default) || this.$slots.default;

        // @ts-ignore
        return defaultSlot?.({
            ...this.$attrs,
            ...this.$props,
            value,
            updateChecked,
            change,
            triggerValue,
            getQuery,
            reset,
        });
    },
});

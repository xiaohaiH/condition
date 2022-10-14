import { computed, defineComponent, inject, onBeforeUnmount, PropType, ref, watch } from 'vue-demi';
import { existsEvent } from '../../utils/assist';
import { hasOwn } from '../../utils/index';
import { selectProps } from '../../common/props';
import { selectEmits } from '../../common/emits';
import { CommonMethod, provideKey, ProvideValue } from '../../common/provide';

/**
 * @file 下拉框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'CoreSelect',
    props: selectProps,
    emits: selectEmits,
    setup(props, ctx) {
        const wrapper = inject<ProvideValue>(provideKey);
        const checked = ref<string | string[]>(props.multiple ? [] : '');
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
            get validator() {
                return props.validator;
            },
            getQuery,
        };
        wrapper?.register(option);

        const unwatchs: (() => void)[] = [];
        onBeforeUnmount(() => unwatchs.forEach((v) => v()));

        // 回填值发生变化时触发更新
        const { field, depend, dependFields } = props;
        // 需要通知父级更新 query
        unwatchs.push(watch(() => props.backfill?.[field], change, { immediate: true, deep: true }));

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
                        change(props.multiple ? [] : '');
                        const { getDict } = props;
                        if (getDict) {
                            getDict((data) => {
                                const _checked = checked.value;
                                // 重置 checked, 防止增加 option 后, select 值没更新的问题
                                checked.value = undefined as any;
                                remoteOption.value = data || [];
                                checked.value = _checked;
                            }, props.query || {});
                        }
                    },
                    { deep: true, immediate: true },
                ),
            );
        }

        // this.innerDisabled = disabledMethod(this);
        // this.innerHide = hideMethod(this);

        /**
         * @description: 失焦事件
         */
        function blur() {
            existsEvent(ctx, 'blur') && ctx.emit('blur', ...arguments);
            props.filterMethod && finalFilterMethod('');
        }

        /**
         * @description: 过滤方法
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
         * @description: select change 事件
         * @param {String} value: 输入值
         */
        function change(value: string | string[]) {
            checked.value = value;
            triggerValue();
        }
        /**
         * @description: 获取返回到上层的值
         *
         * @return {Object}
         */
        function getQuery() {
            return { [props.field]: checked.value || undefined };
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
        function reset() {
            const { multiple } = props;
            checked.value = multiple ? [] : '';
            return option;
        }

        return {
            checked,
            finalOption,
            customFilterMethod,
            blur,
            change,
            getQuery,
            triggerValue,
            reset,
        };
    },
    render() {
        const {
            checked: value,
            finalOption: options,
            blur,
            customFilterMethod: filterMethod,
            change,
            getQuery,
            triggerValue,
            reset,
        } = this;
        // @ts-ignore
        const defaultSlot = (hasOwn(this, '$scopedSlots') && this.$scopedSlots.default) || this.$slots.default;

        // @ts-ignore
        return defaultSlot?.({
            ...this.$attrs,
            ...this.$props,
            value,
            options,
            blur,
            filterMethod,
            change,
            getQuery,
            triggerValue,
            reset,
        });
    },
});

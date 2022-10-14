import { computed, defineComponent, inject, onBeforeUnmount, PropType, ref, watch } from 'vue-demi';
import { existsEvent } from '../../utils/assist';
import { hasOwn } from '../../utils/index';
import { cascadertProps } from '../../common/props';
import { cascaderEmits } from '../../common/emits';
import { CommonMethod, provideKey, ProvideValue } from '../../common/provide';
import { nextTick } from 'process';

/**
 * @file 级联选择器
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'CoreCascader',
    props: cascadertProps,
    emits: cascaderEmits,
    setup(props, ctx) {
        const wrapper = inject<ProvideValue>(provideKey);
        const checked = ref<string[]>([]);
        const checkedStr = computed(() => {
            const { emitPath } = props;
            return emitPath ? checked.value.join('') : checked.value.slice(-1)[0];
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

        const { field, fields } = props;
        unwatchs.push(
            watch(
                () => ([] as string[]).concat(fields || field).reduce((p, v) => `${p}${props.backfill?.[v] || ''}`, ''),
                (value) => {
                    if (value === checkedStr.value) return;
                    if (typeof value === 'string') {
                        if (this.finalOption.length) {
                            checked.value = this.getChainedValues(value);
                        } else {
                            this.temporaryValue = value;
                        }
                    } else {
                        checked.value = value || [];
                    }
                },
                { immediate: true, deep: true },
            ),
        );

        // this.innerDisabled = disabledMethod(this);
        // this.innerHide = hideMethod(this);

        /**
         * @description: change 事件
         * @param {Array} values: 选中的数据
         */
        function change(values: string[]) {
            this.insetTrigger = true;
            checked.value = values;
            triggerValue();
            nextTick(() => {
                this.insetTrigger = false;
            });
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
            const { field, fields, formatField, oldParams, temporaryValue } = props;

            const emitPath = props && props.emitPath;

            // 当数据是远程获取时, 会涉及到一个异步问题导致初次回填数据失败
            // 所以直接返回当前条件中属于该组件的条件
            const query = temporaryValue
                ? this.getCurrentCondition()
                : fields
                ? formatField(checked.value.slice(), this.$refs.cascader.getCheckedNodes(), fields.slice(), emitPath)
                : { [field]: emitPath ? checked.value : checked.value.slice(-1)[0] };

            return { ...oldParams, ...query };
        }
        /**
         * @description: 获取当前条件中属于该组件的条件
         */
        function getCurrentCondition() {
            const { backfill, fields, field } = props;
            return ([] as string[]).concat(fields || field).reduce((p, k) => {
                backfill?.[k] && (p[k] = backfill[k]);
                return p;
            }, {} as Record<string, any>);
        }
        /**
         * @description: 获取返回到上层的值
         *
         * @return {Object}
         */
        function reset() {
            const { fields, field, formatField, emitPath, oldParams } = props;
            const _checked = checked.value.slice();
            this.temporaryValue = '';
            checked.value = [];

            // 由于渲染机制是异步的, 这里的 $refs.cascader.getCheckedNodes 拿到的是旧值
            // 所以不调用 getQuery 来获取数据
            const query = fields
                ? formatField(_checked, [], fields.slice(), emitPath)
                : { [field]: emitPath ? _checked : _checked.slice(-1)[0] };

            const result = { ...oldParams };
            Object.keys(query).every((k) => {
                result[k] = undefined;
                return true;
            });

            return result;
        }
        /**
         * @description: 获取选中值的全级
         * @param {String} checked: 选中的值
         *
         * @return {Array}
         */
        function getChainedValues(checked: string[]) {
            const {
                finalOption,
                finalProps: { value },
            } = this;
            return getChained(finalOption, { [value]: checked }).map((v) => v[value]);
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

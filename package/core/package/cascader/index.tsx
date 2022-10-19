import { computed, defineComponent, inject, onBeforeUnmount, PropType, ref, watch, nextTick } from 'vue-demi';
import { existsEvent, getSlot } from '../../utils/assist';
import { hasOwn, emptyToValue, getChained } from '../../utils/index';
import { cascadertProps } from '../../common/props';
// import { cascaderEmits } from '../../common/emits';
import { CommonMethod, provideKey, ProvideValue } from '../../common/provide';
import { useDisplay } from '../../use';

export type ValueType = string | number | null | undefined;

/** 判断是否是空值 */
function isEmpty(val: any): boolean {
    return Array.isArray(val) ? !!val.length : !val && val !== 0;
}

/**
 * @file 级联选择器
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'CoreCascader',
    props: cascadertProps,
    // emits: cascaderEmits,
    setup(props, ctx) {
        const { field: FIELD, fields: FIELDS, backfill: BACKFILL, getDict } = props;
        const DATA_ASYNC = {
            initialize: isEmpty(BACKFILL?.[FIELD]) || typeof getDict !== 'function',
            initialValue: BACKFILL?.[FIELD],
        };
        const wrapper = inject<ProvideValue>(provideKey);
        const checked = ref<ValueType[]>([]);
        const getQuery = () =>
            FIELDS?.length
                ? FIELDS.reduce((p, v, i) => Object.assign(p, { [v]: checked.value[i] }), {})
                : { [FIELD]: props.emitPath ? [...checked.value] : checked.value.slice(-1)[0] };
        /** 远程获取的数据源 */
        const remoteOption = ref<Record<string, any>[]>([]);
        /** 优先使用远程数据源 */
        const finalOption = computed(() => (remoteOption.value.length ? remoteOption.value : props.options));
        let initialValue = FIELDS?.length
            ? FIELDS.reduce((p, k) => {
                  BACKFILL?.[k] && p.push(BACKFILL[k]);
                  return p;
              }, [] as ValueType[])
            : Array.isArray(BACKFILL?.[FIELD])
            ? BACKFILL![FIELD]
            : DATA_ASYNC.initialize
            ? insideGetChained(BACKFILL?.[FIELD])
            : [];

        const option: CommonMethod = {
            reset,
            get validator() {
                return props.validator;
            },
            updateWrapperQuery() {
                const { field, fields, emitPath } = props;
                if (!DATA_ASYNC.initialize) {
                    // 数据未初始化前, 不对结果做任何操作
                    wrapper?.updateQueryValue(field, DATA_ASYNC.initialValue);
                } else {
                    if (fields?.length) {
                        fields.forEach((k, i) => {
                            wrapper?.updateQueryValue(k, emptyToValue(checked.value[i], props.emptyValue));
                        });
                    } else {
                        wrapper?.updateQueryValue(
                            field,
                            emptyToValue(emitPath ? [...checked.value] : checked.value.slice(-1)[0], props.emptyValue),
                        );
                    }
                }
                return option;
            },
            getQuery,
        };
        wrapper?.register(option);
        const { insetDisabled, insetHide } = useDisplay(props, option);

        const unwatchs: (() => void)[] = [];
        onBeforeUnmount(() => unwatchs.forEach((v) => v()));

        // 回填值发生变化时触发更新
        unwatchs.push(watch(() => props.getDict, getOption, { immediate: true }));
        unwatchs.push(
            watch(
                () =>
                    props.fields?.length
                        ? props.fields.reduce((p, k) => {
                              props.backfill?.[k] && p.push(props.backfill[k]);
                              return p;
                          }, [] as string[])
                        : props.backfill?.[props.field],
                (value: ValueType | ValueType[]) => {
                    if (Array.isArray(value)) {
                        if (value.join('') === checked.value.join('')) return;
                        updateCheckedValue(value);
                    } else {
                        if (!value && value !== 0) {
                            checked.value.length && (checked.value = []);
                            return;
                        }
                        if (!DATA_ASYNC.initialize) {
                            option.updateWrapperQuery();
                        } else {
                            updateCheckedValue(insideGetChained(value));
                        }
                    }
                },
                { immediate: true, deep: true },
            ),
        );

        /**
         * 获取数据源发生变化事件
         */
        function getOption() {
            props.getDict?.((data) => {
                const _checked = checked.value;
                // 重置 checked, 防止增加 option 后, cascader 值没更新的问题
                checked.value = [];
                remoteOption.value = data || [];
                checked.value = _checked;
                if (!DATA_ASYNC.initialize) {
                    updateCheckedValue((initialValue = insideGetChained(DATA_ASYNC.initialValue)));
                    DATA_ASYNC.initialize = true;
                }
            }, props.query || {});
        }
        /**
         * 更新选中值(父级也同步更改)
         * @param {ValueType | ValueType[]} values 待更改的值
         */
        function updateCheckedValue(values: ValueType[] | ValueType) {
            const _checked = Array.isArray(values) ? values : insideGetChained(values);
            if (_checked.join('') === checked.value.join('')) return;
            checked.value = _checked;
            option.updateWrapperQuery();
        }
        /**
         * change 事件
         * @param {Array} values 待更改的值
         */
        function change(values: ValueType[] | ValueType) {
            updateCheckedValue(values);
            wrapper?.insetSearch();
        }
        /**
         * 重置数据
         */
        function reset() {
            checked.value = props.resetToInitialValue ? initialValue : [];
            return option;
        }
        /**
         * 根据提供的值获取其祖先(包括自身)
         */
        function insideGetChained(val: ValueType) {
            if (!val && val !== 0) return [];
            const { valueKey, childrenKey } = props;
            return getChained(finalOption.value, (item) => item[valueKey] === val).map((v) => v[valueKey], childrenKey);
        }

        return {
            checked,
            getQuery,
            finalOption,
            insetDisabled,
            insetHide,
            change,
            reset,
        };
    },
    render() {
        const {
            checked: value,
            getQuery,
            finalOption,
            insetHide,
            insetDisabled,
            change,
            reset,
            clearable,
            filterMethod,
        } = this;
        if (insetHide) return void 0 as any;
        const defaultSlot = getSlot('default', this);
        const listeners = hasOwn(this, '$listeners') ? this.$listeners : null;

        return typeof defaultSlot === 'function'
            ? defaultSlot({
                  ...this.$attrs,
                  options: finalOption,
                  listeners,
                  value,
                  disabled: insetDisabled,
                  change,
                  clearable,
              })
            : defaultSlot!;
    },
});

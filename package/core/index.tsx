import { computed, defineComponent, onBeforeUnmount, PropType, ref, watch } from 'vue-demi';

const commonProps = {
    /** 提交的字段 */
    field: { type: String as PropType<string>, required: true },
    /** 显示在 input 框前的文字 */
    prefix: { type: String as PropType<string> },
    /** 当前条件对象 - 实时变化 */
    query: { type: Object as PropType<Record<string, any>> },
    /** 回填值的对象 - 非实时变化 */
    backfill: { type: Object as PropType<Record<string, any>> },
    /** 禁用状态 */
    disabled: { type: [Boolean, Function] as PropType<boolean | Function> },
    /** 是否隐藏 -> 如果是函数, 需传递依赖项, 可根据依赖项动态隐藏 */
    hide: { type: [Boolean, Function] as PropType<boolean | Function> },
    /** 是否依赖其它字段 - 字典请求 */
    depend: { type: Boolean as PropType<boolean> },
    /** 依赖字段 - 字段发生改变时做请求 */
    dependFields: { type: [String, Array] as PropType<string | string[]> },
    /** 校验函数, 返回字符串不通过, 会触发提示 - 提交时触发 */
    validator: { type: [Function] as PropType<Function | (() => Promise<any>)> },
} as const;

export default defineComponent({
    props: {
        ...commonProps,
        // 提交给后端的字段
        valueKey: { type: String },
        // 展示的字段
        labelKey: { type: String },
        // 下拉选项的数据源
        option: { type: Array, default: () => [] },
        // 是否多选
        multiple: { type: Boolean },
        // 获取数据
        getDict: {
            type: Function as PropType<(cb: (data: Record<string, any>[]) => void, query: Record<string, any>) => any>,
        },
        // 是否允许清空 - 默认允许
        clearable: { type: Boolean, default: true },
        // 自定义筛选方法
        filterMethod: { type: Function },
    },
    setup(props, ctx) {
        const checked = ref<string | string[]>(props.multiple ? [] : '');
        const remoteOption = ref<Record<string, any>[]>([]);
        const originOption = computed(() => (remoteOption.value.length ? remoteOption.value : props.option));

        const unwatchs: (() => void)[] = [];
        onBeforeUnmount(() => unwatchs.forEach((v) => v()));

        // 回填值发生变化时触发更新
        const { field, depend, dependFields } = props;
        unwatchs.push(
            watch(
                () => props.backfill?.[field],
                (val) => {
                    checked.value = val;
                },
                { immediate: true, deep: true },
            ),
        );

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
            this.$listeners.blur && ctx.emit('blur', ...arguments);
            this.filterMethod && this.finalFilterMethod();
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
            return { [props.field]: checked.value };
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
            const { field, multiple } = props;
            checked.value = multiple ? [] : '';
            return { [field]: checked.value || undefined };
        }

        return {
            blur,
            change,
            getQuery,
            triggerValue,
            reset,
        };
    },
    render() {
        // console.log(args);
        return <div>123</div>;
    },
});

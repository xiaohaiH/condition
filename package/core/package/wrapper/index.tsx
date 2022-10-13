import { defineComponent, nextTick, onMounted, PropType, provide, ref, set, watch, watchEffect } from 'vue-demi';
import { hasOwn } from '../../utils/index';
import { wrapperProp } from '../../common/props';
import { wrapperEmits } from '../../common/emits';
import { provideKey, ProvideValue, CommonMethod } from '../../common/provide';

// 内部通过注入
// 外部通过 t 自己检索动态渲染组件

export default defineComponent({
    inheritAttrs: false,
    props: wrapperProp,
    emits: wrapperEmits,
    setup(props, ctx) {
        const child: CommonMethod[] = [];
        provide<ProvideValue>(provideKey, {
            register: (compOption) => {
                child.push(compOption);
            },
        });

        /** 实时检索的值 */
        const query = ref<Record<string, string>>({});
        /** 条件发生变化后, 更新 query 字段 */
        watch(
            () => props.datum,
            () => {
                nextTick(initQuery);
            },
            { immediate: true },
        );
        watch(
            () => props.backfill,
            (value) => {
                query.value = { ...value };
            },
            { immediate: true },
        );
        function initQuery() {
            const { backfill } = props;
            query.value = { ...backfill, ...genCompQuery() };
        }
        onMounted(() => {
            initQuery();
            props.immediateTrigger && ctx.emit('ready', query.value);
        });

        /**
         * @description: 组件的搜索事件
         * @param {Object} params: 搜索的值
         */
        function compSearch(params: Record<string, string>) {
            const { realtime } = props;
            set(query, 'value', { ...query.value, ...params });
            // Object.assign(query, params);
            realtime && querySearch();
        }
        /**
         * @description: 搜索事件
         */
        async function querySearch() {
            const r = await Promise.all(child.map((v) => v.validator?.(query.value)));
            const msg = r.find((v) => v && typeof v === 'string');
            msg ? props.toast(msg) : ctx.emit('search', getQuery());
        }
        /**
         * @description: 获取参数
         */
        function getQuery() {
            return { ...query.value };
        }
        /**
         * @description: 重置事件
         */
        function reset() {
            resetValue();
            querySearch();
        }
        /**
         * @description: 重置事件
         */
        function resetValue() {
            const params = child.reduce((p, v) => Object.assign(p, v.reset().getQuery()), {}) || {};
            Object.assign(query.value, params);
        }
        /**
         * @description: 获取组件的 query 信息
         *
         * @return {Object}
         */
        function genCompQuery() {
            if (!child.length) return {};
            return child.reduce((p, v) => Object.assign(p, v.getQuery()), {});
        }
        return {
            child,
            initQuery,
            reset,
            resetValue,
            querySearch,
            compSearch,
            getQuery,
            genCompQuery,
        };
    },
    render() {
        const { querySearch, getQuery, reset, resetValue, backfill, query, compSearch } = this;
        const Tag = this.tag as string;
        const datum = this.datum as Record<string, any>;
        // @ts-ignore
        const defaultSlot = (hasOwn(this, '$scopedSlots') && this.$scopedSlots.default) || this.$slots.default;
        // @ts-ignore
        const btnSlot = (hasOwn(this, '$scopedSlots') && this.$scopedSlots.btn) || this.$slots.btn;
        const rootProps: Record<string, any> = { attrs: this.$attrs };
        // @ts-ignore
        hasOwn(this, '$listeners') && (rootProps.on = this.$listeners);

        return (
            <Tag {...rootProps}>
                {Object.entries(datum).map(([key, options]) =>
                    // @ts-ignore
                    defaultSlot?.({
                        key,
                        field: options.as || key,
                        backfill,
                        query,
                        compSearch,
                        querySearch,
                        ...options,
                    }),
                )}
                {/* @ts-ignore */}
                {btnSlot?.({
                    search: querySearch,
                    getQuery,
                    reset,
                    resetValue,
                })}
            </Tag>
        );
    },
});

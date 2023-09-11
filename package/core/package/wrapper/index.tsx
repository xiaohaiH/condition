import {
    defineComponent,
    getCurrentInstance,
    isVue2,
    nextTick,
    onBeforeUnmount,
    onMounted,
    PropType,
    provide,
    ref,
    set,
    toRef,
    watch,
    watchEffect,
} from 'vue-demi';
import { hasOwn } from '../../utils/index';
import { getSlot, IS_COMPOSITION_VERSION } from '../../utils/assist';
import { wrapperProps } from '../../common/props';
import { wrapperEmits } from '../../common/emits';
import { provideKey, ProvideValue, CommonMethod } from '../../common/provide';

/**
 * @file 条件包装组件(入口组件)
 * 内部会注入关键信息
 * 外部通过 t 来检索并动态渲染组件
 */
export default defineComponent({
    // inheritAttrs: false,
    name: 'CoreWrapper',
    props: wrapperProps,
    emits: wrapperEmits,
    setup(props, ctx) {
        const child: CommonMethod[] = [];
        onBeforeUnmount(() => child.splice(0));
        /**
         * 提供给子条件组件的方法
         */
        const wrapperInstance: ProvideValue = {
            realtime: toRef(props, 'realtime'),
            register: (compOption) => {
                child.push(compOption);
                const unregister = () => {
                    compOption.reset().updateWrapperQuery();
                    const idx = child.indexOf(compOption);
                    idx !== -1 && child.splice(idx, 1);
                };
                const childInstance = getCurrentInstance();
                // vue2.7 实例挂载在 proxy 上, 内部逻辑取的 proxy 上的值
                // 虽然 @vue/composition-api 实例挂载在 proxy 上
                // 但是内部逻辑取的是整个 getCurrentInstance
                childInstance &&
                    // @ts-ignore
                    onBeforeUnmount(unregister, IS_COMPOSITION_VERSION ? childInstance.proxy : childInstance);
                return unregister;
            },
            updateQueryValue: (field, value) => {
                set(query.value, field, value);
                return wrapperInstance;
            },
            insetSearch: () => {
                props.realtime && wrapperInstance.search();
                return wrapperInstance;
            },
            search: querySearch,
        };
        provide<ProvideValue>(provideKey, wrapperInstance);

        /** 内部条件最新的值, 再没触发搜索按钮前, 不会同步到外部 */
        const query = ref<Record<string, string>>({});
        const getQuery = () => ({ ...query.value });
        /** 条件源发生变化后, 更新 query 字段 */
        watch(() => props.datum, nextTick.bind(null, initQuery), { immediate: true });
        watch(
            () => props.backfill,
            (value) => set(query, 'value', { ...value }),
            { immediate: true },
        );
        /**
         * 初始化搜索对象
         */
        function initQuery() {
            const { backfill } = props;
            query.value = { ...backfill };
            // query.value = { ...backfill, ...genCompQuery() };
        }
        // /**
        //  * 获取组件的 query 信息
        //  */
        // function genCompQuery() {
        //     if (!child.length) return {};
        //     return child.reduce((p, v) => Object.assign(p, v.getQuery()), {});
        // }
        onMounted(() => {
            initQuery();
            props.immediateSearch && ctx.emit('ready', getQuery());
        });

        // /**
        //  * @description: 组件的搜索事件
        //  * @param {Object} params: 搜索的值
        //  */
        // function compSearch(params: Record<string, string>) {
        //     const { realtime } = props;
        //     set(query, 'value', { ...query.value, ...params });
        //     // Object.assign(query, params);
        //     realtime && querySearch();
        // }
        /**
         * 搜索事件
         */
        async function querySearch() {
            const r = await Promise.all(child.map((v) => v.validator?.(query.value)));
            const msg = r.find((v) => v && typeof v === 'string') as string;
            msg ? props.toast(msg) : ctx.emit('search', getQuery());
            if (msg) return msg;
        }
        /**
         * 重置并触发搜索事件
         */
        function resetAndSearch() {
            reset();
            querySearch();
        }
        /**
         * 重置所有条件的值
         */
        function reset() {
            child.forEach((v) => {
                v.reset().updateWrapperQuery();
            });
            ctx.emit('reset', getQuery());
        }
        return {
            child,
            wrapperInstance,
            query,
            getQuery,
            initQuery,
            // genCompQuery,
            querySearch,
            resetAndSearch,
            reset,
            // compSearch,
        };
    },
    render() {
        const {
            resetToInitialValue,
            backfill,
            query,
            getQuery,
            initQuery,
            // genCompQuery,
            querySearch,
            resetAndSearch,
            reset,
        } = this;
        const Tag = this.tag as string;
        const datum = this.datum as Record<string, any>;
        const defaultSlot = getSlot('default', this);
        const btnSlot = getSlot('btn', this);
        let { class: className, style, ...attrs } = this.$attrs;
        const rootProps: Record<string, any> = isVue2 ? {} : { attrs: { class: className, style } };
        // @ts-ignore
        hasOwn(this, '$listeners') && (rootProps.on = this.$listeners);

        return (
            <Tag {...rootProps}>
                {Object.entries(datum).map(([key, options]) =>
                    options
                        ? typeof defaultSlot === 'function'
                            ? defaultSlot({
                                  ...attrs,
                                  key,
                                  field: options.as || key,
                                  resetToInitialValue,
                                  backfill,
                                  query,
                                  ...options,
                              })
                            : defaultSlot || ''
                        : undefined,
                )}
                {typeof btnSlot === 'function'
                    ? btnSlot({
                          search: querySearch,
                          getQuery,
                          resetAndSearch,
                          reset,
                      })
                    : btnSlot}
            </Tag>
        );
    },
});

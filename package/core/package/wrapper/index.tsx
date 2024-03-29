import {
    defineComponent,
    del,
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
import { provideKey, ProvideValue, CommonMethod, defineProvideValue } from '../../common/provide';

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
         * #fix 修复初始 backfill 存在值时
         * query 未保持一致的问题
         * 解决方案:
         * query 本身逻辑和作用不变
         * 新增一个对象用来缓存更改的值
         * 并在获取 query 时, 将该对象作为
         * 最后一个合并项
         */
        const changedQueryObj = {} as Record<string, any>;
        /** 是否标记更新的字段, 防止卸载后的空字段占位 */
        let isLogField = false;
        let logFields: string[] = [];
        /** 提供给子条件组件的方法 */
        const wrapperInstance = defineProvideValue({
            realtime: toRef(props, 'realtime'),
            register(compOption) {
                child.push(compOption);
                const unregister = () => {
                    isLogField = true;
                    compOption.reset();
                    compOption.updateWrapperQuery();
                    const idx = child.indexOf(compOption);
                    idx !== -1 && child.splice(idx, 1);
                    props.searchAtDatumChanged && this.search();
                    // TODO 不确定的一点, 数据源更改后是否需要重置整个数据
                    // 如果需要重置, 得更新后第一次搜索事件时传递的搜索值
                    isLogField = false;
                    logFields.forEach((k) => {
                        del(query.value, k);
                        delete changedQueryObj[k];
                    });
                    logFields = [];
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
            updateQueryValue(field, value) {
                if (isLogField) logFields.push(field);
                set(query.value, field, value);
                changedQueryObj[field] = value;
            },
            insetSearch() {
                props.realtime && this.search();
            },
            search: querySearch,
            removeUnreferencedField(field: string) {
                let sameFieldCount = 0;
                child.some((v) => {
                    v.getQuery().hasOwnProperty(field) && (sameFieldCount += 1);
                    return sameFieldCount;
                });
                if (!sameFieldCount) {
                    del(query.value, field);
                    delete changedQueryObj[field];
                }
            },
        });
        provide<ProvideValue>(provideKey, wrapperInstance);

        /** 内部条件最新的值, 在没触发搜索按钮前, 不会同步到外部 */
        const query = ref<Record<string, string>>({ ...props.backfill });
        const getQuery = () => ({ ...query.value, ...props.backfill, ...changedQueryObj });
        onMounted(() => {
            props.immediateSearch && ctx.emit('ready', getQuery());
        });

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
                v.reset();
                v.updateWrapperQuery();
            });
            ctx.emit('reset', getQuery());
        }
        return {
            child,
            wrapperInstance,
            query,
            getQuery,
            querySearch,
            resetAndSearch,
            reset,
        };
    },
    render() {
        const { resetToInitialValue, backfill, query, getQuery, querySearch, resetAndSearch, reset } = this;
        const Tag = this.tag as string;
        const datum = this.datum as Record<string, any>;
        const defaultSlot = getSlot('default', this);
        const btnSlot = getSlot('btn', this);
        const { class: className, style, ...attrs } = this.$attrs;
        const rootProps: Record<string, any> = isVue2 ? {} : {};
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

<template>
    <ElForm v-bind="rootProps" ref="formRef" :model="query">
        <SortComponent :disabled="!sortable">
            <slot name="prepend" />
            <template v-for="(item, key) of datum" :key="key">
                <component
                    :is="getComponent(item.t)!"
                    v-bind="item"
                    :field="item.as || key"
                    :resetToInitialValue="
                        item.resetToInitialValue === undefined ? resetToInitialValue : item.resetToInitialValue
                    "
                    :backfill="backfill"
                    :query="query"
                >
                    <template v-if="$slots[item.as || key]" #default="scope">
                        <slot :name="item.as || key" v-bind="scope" />
                    </template>
                    <template v-if="`${$slots[item.as || key]}Before`" #before="scope">
                        <slot :name="`${item.as || key}Before`" v-bind="scope" />
                    </template>
                    <template v-if="`${$slots[item.as || key]}After`" #after="scope">
                        <slot :name="`${item.as || key}After`" v-bind="scope" />
                    </template>
                </component>
            </template>
            <slot />
        </SortComponent>
        <slot name="btn" :search="search" :reset="reset" :resetAndSearch="resetAndSearch">
            <template v-if="renderBtn">
                <ElButton :size="size" @click="search">
                    {{ searchText }}
                </ElButton>
                <ElButton :size="size" @click="resetTriggerSearch ? resetAndSearch() : reset()">
                    {{ resetText }}
                </ElButton>
            </template>
        </slot>
    </ElForm>
</template>

<script lang="ts">
import { useWrapper } from '@xiaohaih/condition-core';
import { ElButton, ElForm } from 'element-plus';
import { computed, defineComponent, markRaw, onMounted, PropType, provide, ref } from 'vue';
import { pick } from '../../utils';
import { getComponent } from './components';
import { wrapperEmits as emits, formPropKeys, wrapperProps as props } from './props';
import { SortComponent } from './sortable';
import { wrapperProvideKey } from './config';

/**
 * @file 条件容器
 */
export default defineComponent({
    name: 'HWrapper',
    components: {
        SortComponent,
        ElForm,
        ElButton,
    },
    inheritAttrs: false,
    props,
    emits,
    setup(props, context) {
        const rootProps = computed(() => pick(props, formPropKeys));
        const formRef = ref<InstanceType<typeof ElForm>>();
        const search = (context.emit as any).bind(context, 'search') as unknown as (typeof emits)['search'];
        const reset = (context.emit as any).bind(context, 'reset') as unknown as (typeof emits)['reset'];
        const fieldChange = (context.emit as any).bind(
            context,
            'fieldChange',
        ) as unknown as (typeof emits)['fieldChange'];
        const wrapper = useWrapper(props, { search, reset, fieldChange });
        function resetAndSearch() {
            wrapper.reset();
            wrapper.search();
        }

        onMounted(() => {
            context.emit('ready', wrapper.getQuery());
            props.immediateSearch && search(wrapper.getQuery());
        });

        const result = {
            ...wrapper,
            rootProps,
            formRef,
            getComponent,
            resetAndSearch,
        };
        provide(wrapperProvideKey, result);
        return result;
    },
});
</script>

<style></style>

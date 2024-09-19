<template>
    <ElForm v-bind="rootProps" ref="formRef" :model="query">
        <SortComponent :disabled="!sortable">
            <slot name="prepend"></slot>
            <template v-for="(item, key) of datum" :key="key">
                <component
                    :is="getComponent(item.t)!"
                    v-bind="item"
                    :field="item.as || key"
                    :resetToInitialValue="
                        typeof item.resetToInitialValue === undefined ? resetToInitialValue : item.resetToInitialValue
                    "
                    :backfill="backfill"
                    :query="query"
                >
                    <template v-if="$slots[item.as || key]" #default="scope">
                        <slot :name="item.as || key" v-bind="scope"></slot>
                    </template>
                </component>
            </template>
            <slot></slot>
        </SortComponent>
        <slot name="btn" :search="search" :reset="reset" :resetAndSearch="resetAndSearch">
            <template v-if="renderBtn">
                <ElButton :size="size" @click="search">{{ searchText }}</ElButton>
                <ElButton :size="size" @click="resetTriggerSearch ? resetAndSearch() : reset()">
                    {{ resetText }}
                </ElButton>
            </template>
        </slot>
    </ElForm>
</template>

<script lang="ts">
import { defineComponent, markRaw, PropType, ref, computed, onMounted } from 'vue';
import { ElForm, ElButton } from 'element-plus';
import { useWrapper } from '@xiaohaih/condition-core';
import { pick } from '../../utils';
import { wrapperProps as props, wrapperEmits as emits, formPropKeys } from './props';
import { getComponent } from './components';
import { SortComponent } from './sortable';

/**
 * @file 条件容器
 */
export default defineComponent({
    name: 'HWrapper',
    inheritAttrs: false,
    components: {
        SortComponent,
        ElForm,
        ElButton,
    },
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

        return {
            ...wrapper,
            rootProps,
            formRef,
            getComponent,
            resetAndSearch,
        };
    },
});
</script>

<style></style>

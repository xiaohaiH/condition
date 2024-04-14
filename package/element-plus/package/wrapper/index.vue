<template>
    <ElForm v-bind="rootProps" ref="formRef" :model="query">
        <template v-for="(item, key) of datum" :key="key">
            <component
                :is="getComponent(item.t)!"
                v-bind="item"
                :field="item.as || key"
                :resetToInitialValue="resetToInitialValue"
                :backfill="backfill"
                :query="query"
            />
        </template>
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

/**
 * @file 条件容器
 */
export default defineComponent({
    name: 'HWrapper',
    inheritAttrs: false,
    components: {
        ElForm,
        ElButton,
    },
    props,
    emits,
    setup(props, context) {
        const rootProps = computed(() => pick(props, formPropKeys));
        const formRef = ref<InstanceType<typeof ElForm>>();
        // @ts-expect-error bind重载错误
        const search = context.emit.bind(context, 'search');
        // @ts-expect-error bind重载错误
        const reset = context.emit.bind(context, 'reset');
        const wrapper = useWrapper(props, { search, reset });
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

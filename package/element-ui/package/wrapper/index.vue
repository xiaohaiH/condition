<template>
    <ElForm v-bind="rootProps" ref="formRef" :model="query" v-on="$listeners">
        <SortComponent :disabled="!sortable">
            <slot name="prepend" />
            <template v-for="(item, key) of datum">
                <component
                    :is="getComponent(item.t)"
                    :key="key"
                    v-bind="item"
                    :field="item.as || key"
                    :resetToInitialValue="
                        item.resetToInitialValue === undefined ? resetToInitialValue : item.resetToInitialValue
                    "
                    :backfill="backfill"
                    :query="query"
                />
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
import { Button as ElButton, Form as ElForm } from 'element-ui';
import { computed, defineComponent, markRaw, onMounted, PropType, ref } from 'vue-demi';
import { pick } from '../../utils';
import { getComponent } from './components';
import { wrapperEmits as emits, formPropKeys, wrapperProps as props } from './props';
import { SortComponent } from './sortable';

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
        // @ts-expect-error bind重载错误
        const search = context.emit.bind(context, 'search');
        // // @ts-expect-error bind重载错误
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

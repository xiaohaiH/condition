<template>
    <ElForm v-bind="rootProps" v-on="$listeners" ref="formRef" :model="query">
        <SortComponent :disabled="!sortable">
            <slot name="prepend"></slot>
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
import { computed, defineComponent, markRaw, onMounted, PropType, ref } from 'vue-demi';
import { Form as ElForm, Button as ElButton } from 'element-ui';
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

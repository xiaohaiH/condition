<template>
    <!-- eslint-disable /no-v-for-template-key-on-child -->
    <ElCard>
        <ElCollapse v-model="collapseValue">
            <template v-for="(item, index) of conditions">
                <ElCollapseItem :key="item.name" :title="`${item.title}_2.*`" :name="item.name">
                    <ElAlert type="success" :closable="false">
                        <span>当前条件:　</span>
                        <span>{{ item.query }}</span>
                    </ElAlert>
                    <div style="margin: 10px 0">
                        <ElButton @click="item.setQuery(item)" type="primary" size="mini">手动设置</ElButton>
                        <ElButton
                            v-if="!!item.setCondition"
                            @click="item.setCondition(item)"
                            type="primary"
                            size="small"
                        >
                            更改条件
                        </ElButton>
                    </div>
                    <HWrapper
                        :backfill="item.query"
                        :datum="item.condition"
                        :immediate-search="!!item.defaultValue"
                        :reset-to-initial-value="true"
                        :reset-trigger-search="true"
                        size="mini"
                        tag="main"
                        class="h-condition"
                        @ready="querySearch(index, $event)"
                        @search="querySearch(index, $event)"
                        @reset="reset(item)"
                    >
                        <template #btn="option">
                            <ElButton size="mini" @click="option.search">搜索</ElButton>
                            <ElButton size="mini" @click="option.search">搜索</ElButton>
                            <ElButton size="mini" @click="option.resetAndSearch">重置</ElButton>
                        </template>
                    </HWrapper>
                </ElCollapseItem>
            </template>
        </ElCollapse>
    </ElCard>
</template>

<script lang="ts">
// import { defineComponent, ref, set } from '../composition-api';
import Ab, { defineComponent, ref, set } from '@vue/composition-api';
import { conditionFactory } from './config';
import { HWrapper } from '@xiaohaih/condition-el';
console.log({ Ab });

/**
 * 下拉框
 */
export default defineComponent({
    components: {
        HWrapper,
    },
    setup() {
        const conditions = ref(conditionFactory());
        const collapseValue = ref(conditions.value.map((v) => v.name));
        /**
         * 搜索
         */
        function querySearch(index: number, query: Record<string, string>) {
            set(conditions.value[index], 'query', query);
            console.log(`搜索事件(${index}): `, { ...query });
        }
        /**
         * 搜索
         */
        function reset(item: Record<string, any>) {
            // set(item.query, 'a', '666');
            // console.log('reset', `a 重置后设置为\`${666}\`了`);
        }

        return {
            conditions,
            collapseValue,
            querySearch,
            reset,
            log: console.log,
        };
    },
});
</script>

<style>
.h-condition {
    display: flex;
    flex-wrap: wrap;
}
.condition-item {
    margin-right: 10px;
    margin-bottom: 10px;
    display: flex;
}
.condition-item__label {
    flex: none;
}
.condition-item__label::after {
    content: attr(suffix);
    margin-right: 10px;
}
</style>

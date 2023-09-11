<template>
    <ElCard>
        <ElCollapse v-model="collapseValue">
            <template v-for="(item, index) of conditions" :key="item.name">
                <ElCollapseItem :title="item.title" :name="item.name">
                    <ElAlert type="success" :closable="false">
                        <span>当前条件:　</span>
                        <span>{{ item.query }}</span>
                    </ElAlert>
                    <div style="margin: 10px 0">
                        <ElButton @click="item.setQuery(item)" type="primary" size="small">手动设置</ElButton>
                    </div>
                    <HWrapper
                        :backfill="item.query"
                        :datum="item.condition"
                        size="small"
                        tag="main"
                        @search="querySearch(index, $event)"
                        @reset="reset($event, item)"
                    ></HWrapper>
                </ElCollapseItem>
            </template>
        </ElCollapse>
    </ElCard>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref } from 'vue';
import { HWrapper } from '@xiaohaih/condition-el-plus';
import { conditionFactory } from './config3';

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
            conditions.value[index].query = query;
            console.log(`搜索事件(${index}): `, { ...query });
        }
        /**
         * 搜索
         */
        function reset(query: Record<string, any>, item: Record<string, any>) {
            // query.a = '999';
            // console.log('reset', `a 重置后设置为\`${999}\`了`, query);
            // return;
            item.query.a = '';
            nextTick(() => {
                item.query.a = '999';
                console.log('reset', `a 重置后设置为\`${999}\`了`, item.query);
            });
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

<style scoped></style>

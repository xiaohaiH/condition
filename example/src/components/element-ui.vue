<template>
    <!-- eslint-disable vue/no-v-for-template-key-on-child -->
    <ElCard>
        <ElCollapse v-model="collapseValue">
            <template v-for="(item, index) of conditions">
                <ElCollapseItem :key="item.name" :title="item.title" :name="item.name">
                    <ElAlert type="success" :closable="false">
                        <span>当前条件:　</span>
                        <span>{{ item.query }}</span>
                    </ElAlert>
                    <div style="margin: 10px 0">
                        <ElButton @click="item.setQuery(item)" type="primary" size="mini">手动设置</ElButton>
                    </div>
                    <HWrapper
                        :backfill="item.query"
                        :datum="item.condition"
                        tag="main"
                        @search="querySearch(index, $event)"
                    ></HWrapper>
                </ElCollapseItem>
            </template>
        </ElCollapse>
    </ElCard>
</template>

<script lang="ts">
import { Vue, defineComponent, ref, set } from 'vue-demi';
import ElementUI from 'element-ui';
import { HWrapper } from 'h-element-ui';
import { conditionFactory } from './config';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

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
        }

        return {
            conditions,
            collapseValue,
            querySearch,
        };
    },
});
</script>

<style scoped></style>

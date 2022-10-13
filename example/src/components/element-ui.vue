<template>
    <ElCard>
        <ElCollapse v-model="collapseValue">
            <ElCollapseItem title="基础用法" name="base">
                <ElAlert type="success" :closable="false">
                    <span>当前条件:　</span>
                    <span>{{ baseQuery }}</span>
                </ElAlert>
                <div style="margin: 10px 0">
                    <ElButton @click="setBaseQuery" type="primary" size="mini">手动设置</ElButton>
                </div>
                <HWrapper :backfill="baseQuery" :datum="baseCondition" @search="baseQuerySearch"></HWrapper>
            </ElCollapseItem>
        </ElCollapse>
    </ElCard>
</template>

<script lang="ts">
import { Vue, defineComponent, ref, set } from 'vue-demi';
import ElementUI from 'element-ui';
import { HWrapper } from 'h-element-ui';
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
        const collapseValue = ref(['base']);
        const baseCondition = ref({
            a: {
                t: 'input',
                clearable: true,
                placeholder: '角色名称',
            },
            b: {
                t: 'select',
                placeholder: '状态',
                valueKey: 'dictValue',
                labelKey: 'dictLabel',
                size: 'mini',
                option: [
                    { dictValue: '0', dictLabel: '启用' },
                    { dictValue: '1', dictLabel: '禁用' },
                ],
            },
        });
        const baseQuery = ref({});
        function setBaseQuery() {
            set(baseQuery.value, 'a', '手动设置');
            set(baseQuery.value, 'b', '0');
        }
        function baseQuerySearch(query: Record<string, string>) {
            set(baseQuery, 'value', query);
        }

        return {
            collapseValue,
            baseCondition,
            baseQuery,
            setBaseQuery,
            baseQuerySearch,
        };
    },
});
</script>

<style scoped></style>

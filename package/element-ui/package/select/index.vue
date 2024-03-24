<template>
    <ElFormItem
        :class="`condition-item condition-item--select condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElSelect
            v-bind="selectProps"
            v-on="$listeners"
            :disabled="insetDisabled"
            :filter-method="filterMethod && customFilterMethod"
            :value="checked"
            class="condition-item__content"
            @input="change"
            @blur="customFilterMethod('')"
            @change="customFilterMethod('')"
        >
            <template v-for="item of filterSource">
                <template v-if="item.group && item.children">
                    <ElOptionGroup :key="item[valueKey]" :label="item[labelKey]">
                        <template v-for="group of item.children">
                            <ElOption
                                :key="group[valueKey]"
                                :label="group[labelKey]"
                                :value="group[valueKey]"
                            ></ElOption>
                        </template>
                    </ElOptionGroup>
                </template>
                <template v-else>
                    <ElOption :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]"></ElOption>
                </template>
            </template>
        </ElSelect>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
            <template v-else><component :is="getNode(postfix, checked)"></component></template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue-demi';
import {
    FormItem as ElFormItem,
    Select as ElSelect,
    OptionGroup as ElOptionGroup,
    Option as ElOption,
} from 'element-ui';
import { pick } from 'lodash-es';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { selectProps as props } from './props';
import { formItemPropKeys } from '../share';

// @ts-expect-error UI.props报错
const selectPropKeys = Object.keys(ElSelect.props);

/**
 * @file 下拉框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HSelect',
    components: {
        ElFormItem,
        ElSelect,
        ElOptionGroup,
        ElOption,
    },
    props,
    setup(props, ctx) {
        const plain = usePlain(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const selectProps = computed(() => pick(props, selectPropKeys));

        const filterValue = ref('');
        const customFilterMethod = (val: string) => {
            filterValue.value = val;
        };
        const filterSource = computed(() => {
            const val = filterValue.value;
            return val ? plain.finalOption.value.filter(props.filterMethod!.bind(null, val)) : plain.finalOption.value;
        });

        return {
            ...plain,
            formItemProps,
            selectProps,
            getNode,
            filterValue,
            customFilterMethod,
            filterSource,
        };
    },
});
</script>

<style lang="css" scoped></style>

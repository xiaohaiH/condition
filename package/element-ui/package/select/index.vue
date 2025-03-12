<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--select condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
    >
        <ElSelect
            v-bind="contentProps"
            :disabled="insetDisabled"
            :filter-method="filterMethod && customFilterMethod"
            :value="checked"
            class="condition-item__content"
            v-on="$listeners"
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
                            />
                        </template>
                    </ElOptionGroup>
                </template>
                <template v-else>
                    <ElOption :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]" />
                </template>
            </template>
        </ElSelect>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">
                {{ postfix }}
            </template>
            <template v-else>
                <component :is="getNode(postfix, checked)" />
            </template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { getNode, usePlain } from '@xiaohaih/condition-core';
import {
    FormItem as ElFormItem,
    Option as ElOption,
    OptionGroup as ElOptionGroup,
    Select as ElSelect,
} from 'element-ui';
import { computed, defineComponent, ref } from 'vue-demi';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { selectProps as props } from './props';

// @ts-expect-error UI.props报错
const contentPropsKeys = Object.keys(ElSelect.props);

/**
 * @file 下拉框
 */
export default defineComponent({
    name: 'HSelect',
    components: {
        ElFormItem,
        ElSelect,
        ElOptionGroup,
        ElOption,
    },
    inheritAttrs: false,
    props,
    setup(props, ctx) {
        const plain = usePlain(props);
        const formItemProps = computed(() => pick(props, formItemPropKeys));
        const contentProps = computed(() => pick(props, contentPropsKeys));

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
            contentProps,
            getNode,
            filterValue,
            customFilterMethod,
            filterSource,
        };
    },
});
</script>

<style lang="css" scoped></style>

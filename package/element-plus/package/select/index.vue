<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--select condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
        v-bind.prop="formDynamicFields?.({ query })"
    >
        <template v-if="slotBefore || $slots.before">
            <component :is="getNode(slotBefore!, slotProps)" v-if="slotBefore" />
            <slot v-else name="before" v-bind="slotProps" />
        </template>
        <template v-if="slotDefault">
            <component :is="getNode(slotDefault, slotProps)" />
        </template>
        <slot v-else v-bind="slotProps">
            <ElSelect
                v-bind="contentProps"
                :disabled="insetDisabled"
                :model-value="(checked as string[])"
                :filter-method="filterMethod && customFilterMethod"
                class="condition-item__content"
                v-bind.prop="dynamicFields?.({ query })"
                @update:model-value="change"
            >
                <template v-for="item of filterSource" :key="item[valueKey]">
                    <template v-if="item.group && item.children">
                        <ElOptionGroup :label="item[labelKey]" :disabled="item[disabledKey]">
                            <template v-for="group of item.children" :key="group[valueKey]">
                                <ElOption :label="group[labelKey]" :value="group[valueKey]">
                                    <template v-if="optionSlot || $slots.optionSlot">
                                        <component :is="getNode(optionSlot!, { item: group, parent: item })" v-if="optionSlot" />
                                        <slot v-else name="optionSlot" :item="group" :parent="item" />
                                    </template>
                                </ElOption>
                            </template>
                        </ElOptionGroup>
                    </template>
                    <template v-else>
                        <ElOption
                            :label="item[labelKey]"
                            :value="item[valueKey]"
                            :disabled="item[disabledKey]"
                        >
                            <template v-if="optionSlot || $slots.optionSlot">
                                <component :is="getNode(optionSlot!, { item })" v-if="optionSlot" />
                                <slot v-else name="optionSlot" :item="item" />
                            </template>
                        </ElOption>
                    </template>
                </template>
            </ElSelect>
        </slot>
        <template v-if="slotAfter || $slots.after">
            <component :is="getNode(slotAfter!, slotProps)" v-if="slotAfter" />
            <slot v-else name="after" v-bind="slotProps" />
        </template>
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
import { ElFormItem, ElOption, ElOptionGroup, ElSelect } from 'element-plus';
import { computed, customRef, defineComponent, ref } from 'vue';
import { pick } from '../../utils';
import { formItemPropKeys } from '../share';
import { selectProps as props } from './props';

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
        const slotProps = computed(() => ({
            ...contentProps.value,
            'disabled': plain.insetDisabled.value,
            'modelValue': plain.checked.value,
            'source': filterSource.value,
            'filterMethod': props.filterMethod && customFilterMethod,
            'labelKey': props.labelKey,
            'valueKey': props.valueKey,
            'onUpdate:modelValue': plain.change,
            'class': 'condition-item__content',
            'extraOption': {
                query: props.query,
                search: plain.wrapper!.search,
                insetSearch: plain.wrapper!.insetSearch,
            },
        }));

        return {
            ...plain,
            formItemProps,
            contentProps,
            getNode,
            filterValue,
            customFilterMethod,
            filterSource,
            slotProps,
        };
    },
});
</script>

<style lang="css" scoped></style>

<template>
    <ElFormItem
        v-if="!insetHide"
        :class="`condition-item condition-item--select condition-item--${field} condition-item--${!!postfix}`"
        v-bind="formItemProps"
        :prop="formItemProps.prop || field"
        v-bind.prop="formDynamicFields?.({ query })"
    >
        <template v-if="slotBefore || $slots.before">
            <component v-if="slotBefore" :is="getNode(slotBefore!, slotProps)"></component>
            <slot v-else name="before"></slot>
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
                @update:modelValue="change"
                v-bind.prop="dynamicFields?.({ query })"
            >
                <template v-for="item of filterSource" :key="item[valueKey]">
                    <template v-if="item.group && item.children">
                        <ElOptionGroup :label="item[labelKey]" :disabled="item[disabledKey]">
                            <template v-for="group of item.children" :key="group[valueKey]">
                                <ElOption :label="group[labelKey]" :value="group[valueKey]"></ElOption>
                            </template>
                        </ElOptionGroup>
                    </template>
                    <template v-else>
                        <ElOption
                            :label="item[labelKey]"
                            :value="item[valueKey]"
                            :disabled="item[disabledKey]"
                        ></ElOption>
                    </template>
                </template>
            </ElSelect>
        </slot>
        <template v-if="slotAfter || $slots.after">
            <component v-if="slotAfter" :is="getNode(slotAfter!, slotProps)"></component>
            <slot v-else name="after"></slot>
        </template>
        <div v-if="postfix" class="condition-item__postfix">
            <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
            <template v-else>
                <component :is="getNode(postfix, checked)"></component>
            </template>
        </div>
    </ElFormItem>
</template>

<script lang="ts">
import { computed, customRef, defineComponent, ref } from 'vue';
import { ElFormItem, ElSelect, ElOptionGroup, ElOption } from 'element-plus';
import { pick } from '../../utils';
import { usePlain, getNode } from '@xiaohaih/condition-core';
import { selectProps as props } from './props';
import { formItemPropKeys } from '../share';

const contentPropsKeys = Object.keys(ElSelect.props);

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
            disabled: plain.insetDisabled.value,
            modelValue: plain.checked.value,
            source: filterSource.value,
            filterMethod: props.filterMethod && customFilterMethod,
            labelKey: props.labelKey,
            valueKey: props.valueKey,
            'onUpdate:modelValue': plain.change,
            class: 'condition-item__content',
            extraOption: {
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

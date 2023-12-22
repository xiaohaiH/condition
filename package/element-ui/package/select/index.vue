<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <CorePlain v-bind="$props" v-on="$listeners">
        <template #default="{ labelKey, valueKey, options, listeners, blur, change, ...surplusProps }">
            <div :class="`condition-item condition-item--select condition-item--${field} condition-item--${!!postfix}`">
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElSelect
                    :filterable="filterable"
                    :clearable="clearable"
                    v-bind="surplusProps"
                    :filter-method="filterMethod && customFilterMethod"
                    v-on="listeners"
                    class="condition-item__content"
                    @input="change"
                    @blur="customFilterMethod('')"
                    @change="customFilterMethod('')"
                >
                    <template v-for="item of filterSource(options)">
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
                    <template v-else><component :is="getNode(postfix, surplusProps.modelValue)"></component></template>
                </div>
            </div>
        </template>
    </CorePlain>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue-demi';
import { CorePlain } from '@xiaohaih/condition-core';
import { Select as ElSelect, OptionGroup as ElOptionGroup, Option as ElOption } from 'element-ui';
import { selectProps } from '../../src/common/props';
import { getNode } from '@xiaohaih/condition-core/utils/assist';

/**
 * @file 下拉框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HSelect',
    components: {
        CorePlain,
        ElSelect,
        ElOptionGroup,
        ElOption,
    },
    props: selectProps,
    setup(props, ctx) {
        const filterValue = ref('');
        const customFilterMethod = (val: string) => {
            filterValue.value = val;
        };
        const filterSource = computed(() => {
            const val = filterValue.value;
            let r: any, f: any;

            return (source: any[]) => {
                if (source !== f) r = null;
                if (!r) {
                    f = source;
                    r = val ? source.filter(props.filterMethod!.bind(null, val)) : source;
                }
                return r;
            };
        });

        return { getNode, filterValue, customFilterMethod, filterSource };
    },
});
</script>

<style lang="css" scoped></style>

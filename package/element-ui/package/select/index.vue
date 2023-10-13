<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <CoreSelect v-bind="$props" v-on="$listeners">
        <template #default="{ labelKey, valueKey, options, listeners, blur, change, ...surplusProps }">
            <div :class="`condition-item condition-item--select condition-item--${field}`">
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElSelect
                    :filterable="filterable"
                    :clearable="clearable"
                    v-bind="surplusProps"
                    v-on="listeners"
                    class="condition-item__content"
                    @blur="blur"
                    @input="change"
                >
                    <template v-for="item of options">
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
            </div>
        </template>
    </CoreSelect>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';
import { CoreSelect } from '@xiaohaih/condition-core';
import { Select as ElSelect, OptionGroup as ElOptionGroup, Option as ElOption } from 'element-ui';
import { selectProps } from '../../src/common/props';

/**
 * @file 下拉框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HSelect',
    components: {
        CoreSelect,
        ElSelect,
        ElOptionGroup,
        ElOption,
    },
    props: selectProps,
});
</script>

<style lang="css" scoped></style>

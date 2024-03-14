<template>
    <!-- eslint-disable vue/no-deprecated-v-on-native-modifier vue/no-unused-vars -->
    <CorePlain v-bind="$props" :multiple="isMultiple" :fields="insetFields">
        <template #default="{ listeners, updateCheckedValue, change, label, labelSuffix, ...surplusProps }">
            <div
                :class="`condition-item condition-item--datepicker ${isMultiple && 'condition-item--datepicker-range'} condition-item--${field} condition-item--${!!postfix}`"
            >
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElDatePicker
                    :valueFormat="valueFormat"
                    v-bind="surplusProps"
                    class="condition-item__content"
                    @update:modelValue="change"
                ></ElDatePicker>
                <div v-if="postfix" class="condition-item__postfix">
                    <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
                    <template v-else><component :is="getNode(postfix, surplusProps.modelValue)"></component></template>
                </div>
            </div>
        </template>
    </CorePlain>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { CorePlain } from '@xiaohaih/condition-core';
import { ElDatePicker } from 'element-plus';
import { datepickerProps } from '../../src/common/props';
import { getNode } from '@xiaohaih/condition-core/utils/assist';

const reg = /range$/;
function isRange(str: string | undefined) {
    return str ? reg.test(str) : false;
}
/**
 * @file 日期选择
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HDatepicker',
    components: {
        CorePlain,
        ElDatePicker,
    },
    props: datepickerProps,
    setup(props, ctx) {
        const isMultiple = computed(() =>
            // @ts-ignore
            props.multiple !== undefined ? props.multiple : isRange(props.type as string),
        );
        const insetFields = computed(
            () =>
                props.fields ||
                (isMultiple.value && props.beginField && props.endField
                    ? [props.beginField, props.endField]
                    : undefined),
        );

        return { isMultiple, insetFields, getNode };
    },
});
</script>

<style lang="css" scoped></style>

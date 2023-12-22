<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-unused-vars -->
    <CorePlain v-bind="$props">
        <template #default="{ labelKey, valueKey, options, listeners, change, modelValue, ...surplusProps }">
            <div :class="`condition-item condition-item--radio condition-item--${field} condition-item--${!!postfix}`">
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElRadioGroup
                    ref="radioGroupRef"
                    v-bind="surplusProps"
                    :modelValue="modelValue"
                    class="condition-item__content"
                    @update:modelValue="change"
                >
                    <template v-for="item of options" :key="item[valueKey]">
                        <component
                            :is="radioType"
                            :label="item[valueKey]"
                            v-on:[eventName].prevent="customChange(item[valueKey], modelValue, change)"
                        >
                            {{ item[labelKey] }}
                        </component>
                    </template>
                </ElRadioGroup>
                <div v-if="postfix" class="condition-item__postfix">
                    <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
                    <template v-else><component :is="getNode(postfix, modelValue)"></component></template>
                </div>
            </div>
        </template>
    </CorePlain>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { CorePlain } from '@xiaohaih/condition-core';
import { ElRadioGroup, ElRadioButton, ElRadio } from 'element-plus';
import { radioProps } from '../../src/common/props';
import { getNode } from '@xiaohaih/condition-core/utils/assist';

/**
 * @file 单选框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HRadio',
    components: {
        CorePlain,
        ElRadioGroup,
        ElRadioButton,
        ElRadio,
    },
    props: radioProps,
    setup(props, context) {
        const radioGroupRef = ref<InstanceType<typeof ElRadioGroup> | undefined>();
        const radioType = computed(() => (props.type === 'button' ? 'ElRadioButton' : 'ElRadio'));

        const eventName = computed(() => (props.cancelable ? 'click' : null));
        /**
         * 单选框选中事件
         * @param {string} newVal 最新选中值
         * @param {string} currentVal 当前值
         * @param {Function} cb 值更改的回调
         */
        function customChange(newVal: string, currentVal: string, cb: (value?: string) => void) {
            cb(newVal === currentVal ? '' : newVal);
        }

        return { radioGroupRef, radioType, eventName, customChange, getNode };
    },
});
</script>

<style lang="css" scoped></style>

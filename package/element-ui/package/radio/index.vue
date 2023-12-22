<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child -->
    <CorePlain v-bind="$props" v-on="$listeners">
        <template #default="{ labelKey, valueKey, options, listeners, change, value, ...surplusProps }">
            <div :class="`condition-item condition-item--radio condition-item--${field} condition-item--${!!postfix}`">
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElRadioGroup
                    ref="radioGroupRef"
                    v-bind="surplusProps"
                    v-on="listeners"
                    :value="value"
                    class="condition-item__content"
                    @input="change"
                >
                    <template v-for="item of options">
                        <component
                            :is="radioType"
                            :key="item[valueKey]"
                            :label="item[valueKey]"
                            v-on:[eventName].native.prevent="customChange(item[valueKey], value, change)"
                        >
                            {{ item[labelKey] }}
                        </component>
                    </template>
                </ElRadioGroup>
                <div v-if="postfix" class="condition-item__postfix">
                    <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
                    <template v-else><component :is="getNode(postfix, value)"></component></template>
                </div>
            </div>
        </template>
    </CorePlain>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue-demi';
import { CorePlain } from '@xiaohaih/condition-core';
import { RadioGroup as ElRadioGroup, RadioButton as ElRadioButton, Radio as ElRadio } from 'element-ui';
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
        const radioGroupRef = ref<ElRadioGroup | undefined>();
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
            radioGroupRef.value?.$children.forEach((o) => (o.$el as HTMLElement).blur());
        }

        return { radioGroupRef, radioType, eventName, customChange, getNode };
    },
});
</script>

<style lang="css" scoped></style>

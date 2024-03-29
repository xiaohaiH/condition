<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-deprecated-v-on-native-modifier -->
    <CorePlain ref="coreRef" v-bind="$props" v-on="$listeners">
        <template #default="{ listeners, change, label, labelSuffix, ...surplusProps }">
            <div :class="`condition-item condition-item--input condition-item--${field} condition-item--${!!postfix}`">
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <ElInput
                    :clearable="clearable"
                    v-on="listeners"
                    v-bind="surplusProps"
                    @input="debounceChange"
                    @keydown.native.enter="enterHandle"
                    class="condition-item__content"
                ></ElInput>
                <div v-if="postfix" class="condition-item__postfix">
                    <template v-if="typeof postfix === 'string'">{{ postfix }}</template>
                    <template v-else><component :is="getNode(postfix, surplusProps.value)"></component></template>
                </div>
            </div>
        </template>
    </CorePlain>
</template>

<script lang="ts">
import { defineComponent, markRaw, ref, VNode } from 'vue-demi';
import { CorePlain } from '@xiaohaih/condition-core';
import { Input as ElInput } from 'element-ui';
import { inputProps } from '../../src/common/props';
import { getNode } from '@xiaohaih/condition-core/utils/assist';

/**
 * @file 输入框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HInput',
    components: {
        CorePlain,
        ElInput,
    },
    props: inputProps,
    setup(props, ctx) {
        const coreRef = ref<InstanceType<typeof CorePlain>>();

        /**
         * 节流
         * @param {string} value: 输入值
         */
        let timer = 0;
        function debounceChange(value: string) {
            if (!coreRef.value) return;
            const { realtime, waitTime } = props;
            timer && clearTimeout(timer);
            if (realtime || !coreRef.value.wrapper?.realtime.value) {
                coreRef.value.change(value);
            } else {
                if (value !== coreRef.value.checked) {
                    coreRef.value.checked = value;
                }
                if (!coreRef.value.wrapper) return;
                timer = setTimeout(coreRef.value.wrapper.insetSearch, waitTime) as unknown as number;
            }
        }
        /** 回车事件 */
        function enterHandle(ev: Event | KeyboardEvent) {
            if (!coreRef.value) return;
            timer && clearTimeout(timer);
            coreRef.value.checked = (ev.target as HTMLInputElement).value;
            coreRef.value.option.updateWrapperQuery();
            coreRef.value.wrapper?.search();
        }

        return { coreRef, debounceChange, enterHandle, getNode };
    },
});
</script>

<style lang="css" scoped></style>

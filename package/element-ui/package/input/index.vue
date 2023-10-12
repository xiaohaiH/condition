<template>
    <!-- eslint-disable vue/no-deprecated-dollar-listeners-api vue/no-v-for-template-key-on-child vue/no-deprecated-v-on-native-modifier -->
    <CoreInput v-bind="$props" v-on="$listeners">
        <template
            #default="{ listeners, debounceChange, enterHandler, label, labelSuffix, value: val, ...surplusProps }"
        >
            <div
                :class="`condition-item condition-item--input condition-item--${field} ${
                    inputNum > 1 && 'multiple-input'
                }`"
            >
                <div v-if="label" :suffix="labelSuffix" class="condition-item__label">{{ label }}</div>
                <template v-for="inputIndex of inputNum">
                    <ElInput
                        :clearable="clearable"
                        v-bind="surplusProps"
                        :value="val[inputIndex - 1]"
                        :placeholder="placeholders[inputIndex - 1] || placeholder"
                        class="condition-item__content"
                        @input="debounceChange($event, inputIndex - 1)"
                        @keydown.native.enter="enterHandler($event, inputIndex - 1)"
                    ></ElInput>
                    <template v-if="inputSuffix && inputIndex !== inputNum">
                        <span class="condition-item__content-suffix">
                            <template v-if="typeof getNode(inputSuffix, inputIndex) === 'string'">
                                {{ getNode(inputSuffix, inputIndex) }}
                            </template>
                            <template v-else>
                                <component :is="getNode(inputSuffix, inputIndex)"></component>
                            </template>
                        </span>
                    </template>
                </template>
            </div>
        </template>
    </CoreInput>
</template>

<script lang="ts">
import { defineComponent, markRaw, VNode } from 'vue-demi';
import { CoreInput } from '@xiaohaih/condition-core';
import { Input as ElInput } from 'element-ui';
import { inputProps } from '../../src/common/props';

let r: any;
/**
 * @file 输入框
 */
export default defineComponent({
    inheritAttrs: false,
    name: 'HInput',
    components: {
        CoreInput,
        ElInput,
    },
    props: inputProps,
    setup(props, context) {
        /** 获取渲染节点 */
        function getNode(node: string | ((index: number) => VNode) | VNode, idx: number) {
            r = typeof node === 'function' ? node(idx - 1) : node;
            return typeof r === 'string' ? r : markRaw(r);
        }

        return { getNode };
    },
});
</script>

<style lang="css" scoped></style>

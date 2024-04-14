import { markRaw } from 'vue';
import HSelect from '../select/index.vue';
import HInput from '../input/index.vue';
import HDatepicker from '../datepicker/index.vue';
import HCascader from '../cascader/index.vue';
import HRadio from '../radio/index.vue';
import HCheckbox from '../checkbox/index.vue';
import HColorPicker from '../color-picker/index.vue';
import HInputNumber from '../input-number/index.vue';
import HRate from '../rate/index.vue';
import HSlider from '../slider/index.vue';
import HSwitch from '../switch/index.vue';
import HTimePicker from '../time-picker/index.vue';
import HTimeSelect from '../time-select/index.vue';
import HUpload from '../upload/index.vue';
import HSelectV2 from '../select-v2/index.vue';

// 不重新 as 一下会发生👇下方的错误
// https://stackoverflow.com/questions/43900035/ts4023-exported-variable-x-has-or-is-using-name-y-from-external-module-but
const compMap = {
    select: markRaw(HSelect) as typeof HSelect,
    input: markRaw(HInput) as typeof HInput,
    datepicker: markRaw(HDatepicker) as typeof HDatepicker,
    'date-picker': markRaw(HDatepicker) as typeof HDatepicker,
    cascader: markRaw(HCascader) as typeof HCascader,
    radio: markRaw(HRadio) as typeof HRadio,
    checkbox: markRaw(HCheckbox) as typeof HCheckbox,
    'color-picker': markRaw(HColorPicker) as typeof HColorPicker,
    'input-number': markRaw(HInputNumber) as typeof HInputNumber,
    rate: markRaw(HRate) as typeof HRate,
    slider: markRaw(HSlider) as typeof HSlider,
    switch: markRaw(HSwitch) as typeof HSwitch,
    'time-picker': markRaw(HTimePicker) as typeof HTimePicker,
    'time-select': markRaw(HTimeSelect) as typeof HTimeSelect,
    upload: markRaw(HUpload) as typeof HUpload,
    'select-v2': markRaw(HSelectV2) as typeof HSelectV2,
};
const userCompMap: Record<string, any> = {};

/** 默认定义组件的类型 */
export type ComponentType = (typeof compMap)[keyof typeof compMap];

/**
 * 注册自定义组件
 * @param {string} name 类型
 * @param {} comp 可渲染的组件
 */
export function registerComponent(name: string, comp: any) {
    userCompMap[name] = markRaw(comp);
}

/**
 * 删除自定义组件
 * @param {string} name 定义的类型
 */
export function unregisterComponent(name: string) {
    delete userCompMap[name];
}

/**
 * 获取指定组件
 * @param {string} name? 组件类型
 */
export function getComponent(): Record<string, ComponentType>;
export function getComponent(name: string): ComponentType | undefined;
export function getComponent(name?: string) {
    return name ? userCompMap[name] || compMap[name as keyof typeof compMap] : { ...compMap, ...userCompMap };
}

import { markRaw } from 'vue-demi';
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
import HUpload from '../upload/index.vue';

const compMap = {
    select: markRaw(HSelect),
    input: markRaw(HInput),
    datepicker: markRaw(HDatepicker),
    'date-picker': markRaw(HDatepicker),
    cascader: markRaw(HCascader),
    radio: markRaw(HRadio),
    checkbox: markRaw(HCheckbox),
    'color-picker': markRaw(HColorPicker),
    'input-number': markRaw(HInputNumber),
    rate: markRaw(HRate),
    slider: markRaw(HSlider),
    switch: markRaw(HSwitch),
    'time-picker': markRaw(HTimePicker),
    upload: markRaw(HUpload),
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

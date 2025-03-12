import type { CoreCondition } from '@xiaohaih/condition-core';
import type {
    ElCascader,
    ElCheckbox,
    ElColorPicker,
    ElDatePicker,
    ElForm,
    ElFormItem,
    ElInput,
    ElInputNumber,
    ElMention,
    ElRadio,
    ElRate,
    ElSelect,
    ElSelectV2,
    ElSlider,
    ElSwitch,
    ElTimePicker,
    ElTimeSelect,
    ElTreeSelect,
    ElUpload,
} from 'element-plus';
import type { ExtractPropTypes } from 'vue';
import type {
    cascaderProps,
    checkboxProps,
    colorPickerProps,
    customRenderProps,
    datepickerProps,
    inputNumberProps,
    inputProps,
    mentionProps,
    radioProps,
    rateProps,
    selectProps,
    selectV2Props,
    sliderProps,
    switchProps,
    timepickerProps,
    timeSelectProps,
    treeSelectProps,
    uploadProps,
    wrapperProps,
} from './package/index';

export declare namespace HCondition {
    type BuiltInField<T = ''> = CoreCondition.BuiltInField | 'customGetQuery' | 'backfillToValue' | T;
    type OmitDefaultKey<T> = CoreCondition.OmitDefaultKey<T>;
    type FormItemBuiltInField = 'prop' | 'style' | 'class' | 'size';

    interface WrapperProps
        extends ExtractPropTypes<OmitDefaultKey<typeof wrapperProps>>,
        Omit<Props<InstanceType<typeof ElForm>>, 'model' | 'class' | 'style' | 'toast' | 'size'> {}

    /** 条件声明集合 */
    type Condition =
        | CoreCondition.DeepMaybeRef<InputProps>
        | CoreCondition.DeepMaybeRef<SelectProps>
        | CoreCondition.DeepMaybeRef<TreeSelectProps>
        | CoreCondition.DeepMaybeRef<DatepickerProps>
        | CoreCondition.DeepMaybeRef<RadioProps>
        | CoreCondition.DeepMaybeRef<CheckboxProps>
        | CoreCondition.DeepMaybeRef<CascaderProps>
        | CoreCondition.DeepMaybeRef<ColorPickerProps>
        | CoreCondition.DeepMaybeRef<InputNumberProps>
        | CoreCondition.DeepMaybeRef<RateProps>
        | CoreCondition.DeepMaybeRef<SliderProps>
        | CoreCondition.DeepMaybeRef<SwitchProps>
        | CoreCondition.DeepMaybeRef<TimePickerProps>
        | CoreCondition.DeepMaybeRef<TimeSelectProps>
        | CoreCondition.DeepMaybeRef<UploadProps>
        | CoreCondition.DeepMaybeRef<MentionProps>
        | CoreCondition.DeepMaybeRef<CustomRenderProps>
        | CoreCondition.DeepMaybeRef<SelectV2Props>;

    interface InputProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof inputProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElInput>>, keyof typeof inputProps | 'inputStyle'>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'input';
        // 需要重新声明, 否则 ts 会报层级过深
        inputStyle?: string | string[] | Record<string, any>;
    }
    interface SelectProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof selectProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElSelect>>, keyof typeof selectProps>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'select';
    }
    interface TreeSelectProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof treeSelectProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElTreeSelect>>, keyof typeof treeSelectProps>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'tree-select';
    }
    interface DatepickerProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof datepickerProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElDatePicker>>, keyof typeof datepickerProps>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'datepicker' | 'date-picker';
    }
    interface RadioProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof radioProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElRadio>>, keyof typeof radioProps | 'label'>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'radio';
    }
    interface CheckboxProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof checkboxProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElCheckbox>>, keyof typeof checkboxProps | 'label'>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'checkbox';
    }
    interface CascaderProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof cascaderProps>>, BuiltInField | 'props'>,
        Omit<Props<InstanceType<typeof ElCascader>>, keyof typeof cascaderProps>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'cascader';
    }
    interface ColorPickerProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof colorPickerProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElColorPicker>>, keyof typeof colorPickerProps>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'color-picker';
    }
    interface InputNumberProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof inputNumberProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElInputNumber>>, keyof typeof inputNumberProps>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'input-number';
    }
    interface RateProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof rateProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElRate>>, keyof typeof rateProps>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'rate';
    }
    interface SliderProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof sliderProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElSlider>>, keyof typeof sliderProps>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'slider';
    }
    interface SwitchProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof switchProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElSwitch>>, keyof typeof switchProps>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'switch';
    }
    interface TimePickerProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof timepickerProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElTimePicker>>, keyof typeof timepickerProps>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'time-picker';
    }
    interface TimeSelectProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof timeSelectProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElTimeSelect>>, keyof typeof timeSelectProps>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'time-select';
    }
    interface UploadProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof uploadProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElUpload>>, keyof typeof uploadProps>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'upload';
    }
    interface SelectV2Props
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof selectV2Props>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElSelectV2>>, keyof typeof selectV2Props>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'select-v2';
    }
    interface MentionProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof mentionProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElMention>>, keyof typeof mentionProps | 'inputStyle'>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'mention';
        // 需要重新声明, 否则 ts 会报层级过深
        inputStyle?: string | string[] | Record<string, any>;
    }
    interface CustomRenderProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof customRenderProps>>, BuiltInField>,
        Omit<Props<InstanceType<typeof ElFormItem>>, FormItemBuiltInField> {
        t: 'custom-render';
    }

    /** 获取 vue 组件的 props 值 */
    type Props<T extends Record<'$props', any>> = Partial<Writeable<T['$props']>>;

    /** 将数据改为可写 */
    type Writeable<T> = {
        -readonly [K in keyof T]: T[K];
    };
}

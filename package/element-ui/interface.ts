import { ExtractPropTypes } from 'vue-demi';
import { CoreCondition } from '@xiaohaih/condition-core';
import { ElForm } from 'element-ui/types/form';
import { ElFormItem } from 'element-ui/types/form-item';
import { ElSelect } from 'element-ui/types/select';
import { ElInput } from 'element-ui/types/input';
import { ElDatePicker } from 'element-ui/types/date-picker';
import { ElCascader } from 'element-ui/types/cascader';
import { ElRadio } from 'element-ui/types/radio';
import { ElRadioGroup } from 'element-ui/types/radio-group';
import { ElColorPicker } from 'element-ui/types/color-picker';
import { ElInputNumber } from 'element-ui/types/input-number';
import { ElRate } from 'element-ui/types/rate';
import { ElSlider } from 'element-ui/types/slider';
import { ElSwitch } from 'element-ui/types/switch';
import { ElTimePicker } from 'element-ui/types/time-picker';
import { ElUpload } from 'element-ui/types/upload';
import {
    wrapperProps,
    selectProps,
    inputProps,
    datepickerProps,
    radioProps,
    checkboxProps,
    cascaderProps,
    colorPickerProps,
    inputNumberProps,
    rateProps,
    sliderProps,
    switchProps,
    timepickerProps,
    uploadProps,
} from './package/index';

export declare namespace HCondition {
    type BuiltInField<T = ''> = CoreCondition.BuiltInField | 'customGetQuery' | 'backfillToValue' | T;
    type OmitDefaultKey<T> = CoreCondition.OmitDefaultKey<T>;
    type FormItemBuiltInField = 'prop' | 'size';

    interface WrapperProps
        extends ExtractPropTypes<OmitDefaultKey<typeof wrapperProps>>,
            Omit<ElForm, 'model' | 'size'> {}

    /** 条件声明集合 */
    type Condition =
        | CoreCondition.DeepMaybeRef<InputProps>
        | CoreCondition.DeepMaybeRef<SelectProps>
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
        | CoreCondition.DeepMaybeRef<UploadProps>;

    interface InputProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof inputProps>>, BuiltInField>,
            Partial<Omit<ElInput, keyof typeof inputProps>>,
            Omit<ElFormItem, FormItemBuiltInField> {
        t: 'input';
    }
    interface SelectProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof selectProps>>, BuiltInField>,
            Partial<Omit<ElSelect, keyof typeof selectProps>>,
            Omit<ElFormItem, FormItemBuiltInField> {
        t: 'select';
    }
    interface DatepickerProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof datepickerProps>>, BuiltInField>,
            Partial<Omit<ElDatePicker, keyof typeof datepickerProps>>,
            Omit<ElFormItem, FormItemBuiltInField> {
        t: 'datepicker' | 'date-picker';
    }
    interface RadioProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof radioProps>>, BuiltInField>,
            Partial<Omit<ElRadioGroup, keyof typeof radioProps>>,
            Omit<ElFormItem, FormItemBuiltInField> {
        t: 'radio';
    }
    interface CheckboxProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof checkboxProps>>, BuiltInField>,
            Partial<Omit<ElRadioGroup, keyof typeof checkboxProps>>,
            Omit<ElFormItem, FormItemBuiltInField> {
        t: 'checkbox';
    }
    interface CascaderProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof cascaderProps>>, BuiltInField | 'props'>,
            Partial<Omit<ElCascader, keyof typeof cascaderProps>>,
            Omit<ElFormItem, FormItemBuiltInField> {
        t: 'cascader';
    }
    interface ColorPickerProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof colorPickerProps>>, BuiltInField>,
            Partial<Omit<ElColorPicker, keyof typeof colorPickerProps>>,
            Omit<ElFormItem, FormItemBuiltInField> {
        t: 'color-picker';
    }
    interface InputNumberProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof inputNumberProps>>, BuiltInField>,
            Partial<Omit<ElInputNumber, keyof typeof inputNumberProps>>,
            Omit<ElFormItem, FormItemBuiltInField> {
        t: 'input-number';
    }
    interface RateProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof rateProps>>, BuiltInField>,
            Partial<Omit<ElRate, keyof typeof rateProps>>,
            Omit<ElFormItem, FormItemBuiltInField> {
        t: 'rate';
    }
    interface SliderProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof sliderProps>>, BuiltInField>,
            Partial<Omit<ElSlider, keyof typeof sliderProps>>,
            Omit<ElFormItem, FormItemBuiltInField> {
        t: 'slider';
    }
    interface SwitchProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof switchProps>>, BuiltInField>,
            Partial<Omit<ElSwitch, keyof typeof switchProps>>,
            Omit<ElFormItem, FormItemBuiltInField> {
        t: 'switch';
    }
    interface TimePickerProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof timepickerProps>>, BuiltInField>,
            Partial<Omit<ElTimePicker, keyof typeof timepickerProps>>,
            Omit<ElFormItem, FormItemBuiltInField> {
        t: 'time-picker';
    }
    interface UploadProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof uploadProps>>, BuiltInField>,
            Partial<Omit<ElUpload, keyof typeof uploadProps>>,
            Omit<ElFormItem, FormItemBuiltInField> {
        t: 'upload';
    }

    /** 获取 vue 组件的 props 值 */
    type Props<T extends Record<'$props', any>> = Partial<Writeable<T['$props']>>;

    /** 将数据改为可写 */
    type Writeable<T> = {
        -readonly [K in keyof T]: T[K];
    };
}

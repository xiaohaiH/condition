import { ExtractPropTypes } from 'vue';
import { CoreCondition } from '@xiaohaih/condition-core';
import { ElSelect, ElInput, ElDatePicker, ElCascader, ElRadio, ElCheckbox } from 'element-plus';
import {
    wrapperProps,
    selectProps,
    inputProps,
    datepickerProps,
    radioProps,
    checkboxProps,
    cascaderProps,
} from './src/common/props';

export declare namespace HCondition {
    type BuiltInField<T = ''> = CoreCondition.BuiltInField | 'customGetQuery' | 'backfillToValue' | T;
    type OmitDefaultKey<T> = CoreCondition.OmitDefaultKey<T>;

    interface WrapperProps extends CoreCondition.WrapperProps, ExtractPropTypes<OmitDefaultKey<typeof wrapperProps>> {}

    /** 条件声明集合 */
    type Condition =
        | CoreCondition.DeepMaybeRef<InputProps>
        | CoreCondition.DeepMaybeRef<SelectProps>
        | CoreCondition.DeepMaybeRef<DatepickerProps>
        | CoreCondition.DeepMaybeRef<RadioProps>
        | CoreCondition.DeepMaybeRef<CheckboxProps>
        | CoreCondition.DeepMaybeRef<CascaderProps>;

    interface InputProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof inputProps>>, BuiltInField>,
            Omit<Props<InstanceType<typeof ElInput>>, keyof typeof inputProps> {
        t: 'input';
    }
    interface SelectProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof selectProps>>, BuiltInField>,
            Omit<Props<InstanceType<typeof ElSelect>>, keyof typeof selectProps> {
        t: 'select';
    }
    interface DatepickerProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof datepickerProps>>, BuiltInField>,
            Omit<Props<InstanceType<typeof ElDatePicker>>, keyof typeof datepickerProps> {
        t: 'datepicker';
    }
    interface RadioProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof radioProps>>, BuiltInField>,
            Omit<Props<InstanceType<typeof ElRadio>>, keyof typeof radioProps> {
        t: 'radio';
    }
    interface CheckboxProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof checkboxProps>>, BuiltInField>,
            Omit<Props<InstanceType<typeof ElCheckbox>>, keyof typeof checkboxProps> {
        t: 'checkbox';
    }
    interface CascaderProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof cascaderProps>>, BuiltInField>,
            Omit<Props<InstanceType<typeof ElCascader>>, keyof typeof cascaderProps> {
        t: 'cascader';
    }

    /** 获取 vue 组件的 props 值 */
    type Props<T extends Record<'$props', any>> = Partial<Writeable<T['$props']>>;

    /** 将数据改为可写 */
    type Writeable<T> = {
        -readonly [K in keyof T]: T[K];
    };
}

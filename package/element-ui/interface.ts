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
import {
    wrapperProps,
    selectProps,
    inputProps,
    datepickerProps,
    radioProps,
    checkboxProps,
    cascaderProps,
} from './package/index';

export declare namespace HCondition {
    type BuiltInField<T = ''> = CoreCondition.BuiltInField | 'customGetQuery' | 'backfillToValue' | T;
    type OmitDefaultKey<T> = CoreCondition.OmitDefaultKey<T>;

    interface WrapperProps extends ExtractPropTypes<OmitDefaultKey<typeof wrapperProps>>, Omit<ElForm, 'model'> {}

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
            Partial<Omit<ElInput, keyof typeof inputProps>>,
            Omit<ElFormItem, 'prop' | 'size'> {
        t: 'input';
    }
    interface SelectProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof selectProps>>, BuiltInField>,
            Partial<Omit<ElSelect, keyof typeof selectProps>>,
            Omit<ElFormItem, 'prop' | 'size'> {
        t: 'select';
    }
    interface DatepickerProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof datepickerProps>>, BuiltInField>,
            Partial<Omit<ElDatePicker, keyof typeof datepickerProps>>,
            Omit<ElFormItem, 'prop' | 'size'> {
        t: 'datepicker';
    }
    interface RadioProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof radioProps>>, BuiltInField>,
            Partial<Omit<ElRadioGroup, keyof typeof radioProps>>,
            Omit<ElFormItem, 'prop' | 'size'> {
        t: 'radio';
    }
    interface CheckboxProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof checkboxProps>>, BuiltInField>,
            Partial<Omit<ElRadioGroup, keyof typeof checkboxProps>>,
            Omit<ElFormItem, 'prop' | 'size'> {
        t: 'checkbox';
    }
    interface CascaderProps
        extends Omit<ExtractPropTypes<OmitDefaultKey<typeof cascaderProps>>, BuiltInField>,
            Partial<Omit<ElCascader, keyof typeof cascaderProps>>,
            Omit<ElFormItem, 'prop' | 'size'> {
        t: 'cascader';
    }

    /** 获取 vue 组件的 props 值 */
    type Props<T extends Record<'$props', any>> = Partial<Writeable<T['$props']>>;

    /** 将数据改为可写 */
    type Writeable<T> = {
        -readonly [K in keyof T]: T[K];
    };
}

import { CoreCondition } from '@xiaohaih/condition-core';
import { ElSelect, ElInput, ElDatePicker, ElCascader } from 'element-plus';

export declare namespace HCondition {
    interface WrapperProps extends CoreCondition.WrapperProps {
        renderBtn?: boolean;
    }

    type Condition = SelectProps | InputProps | DatepickerProps | CascaderProps;

    interface SelectProps
        extends CoreCondition.SelectProps,
            Omit<Props<InstanceType<typeof ElSelect>>, 'disabled' | 'filterMethod' | 'valueKey' | 'multiple'> {
        t: 'select';
    }
    interface InputProps extends CoreCondition.InputProps, Omit<Props<InstanceType<typeof ElInput>>, 'disabled'> {
        t: 'input';
    }
    interface DatepickerProps
        extends CoreCondition.DatepickerProps,
            Omit<Props<InstanceType<typeof ElDatePicker>>, 'disabled'> {
        t: 'datepicker';
    }
    interface CascaderProps
        extends CoreCondition.CascaderProps,
            Omit<Props<InstanceType<typeof ElCascader>>, 'disabled' | 'options'> {
        t: 'cascader';
    }

    type Props<T extends Record<'$props', any>> = Partial<Writeable<T['$props']>>;

    /** 将数据改为可写 */
    type Writeable<T> = {
        -readonly [K in keyof T]: T[K];
    };
}

import { CoreCondition } from 'core';
import { ElSelect } from 'element-ui/types/select';
import { ElInput } from 'element-ui/types/input';
import { ElDatePicker } from 'element-ui/types/date-picker';
import { ElCascader } from 'element-ui/types/cascader';

export declare namespace HCondition {
    interface WrapperProps extends CoreCondition.WrapperProps {
        renderBtn?: boolean;
    }

    type Condition = SelectProps | InputProps | DatepickerProps | CascadertProps;

    interface SelectProps
        extends CoreCondition.SelectProps,
            Partial<Omit<ElSelect, 'disabled' | 'filterMethod' | 'valueKey' | 'multiple'>> {
        t: 'select';
    }
    interface InputProps extends CoreCondition.InputProps, Partial<Omit<ElInput, 'disabled'>> {
        t: 'input';
    }
    interface DatepickerProps extends CoreCondition.DatepickerProps, Partial<Omit<ElDatePicker, 'disabled'>> {
        t: 'datepicker';
    }
    interface CascadertProps extends CoreCondition.CascadertProps, Partial<Omit<ElCascader, 'disabled' | 'options'>> {
        t: 'cascader';
    }
}

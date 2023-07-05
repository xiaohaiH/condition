import { CoreCondition } from '@xiaohaih/condition-core';
import { ElSelect } from 'element-ui/types/select';
import { ElInput } from 'element-ui/types/input';
import { ElDatePicker } from 'element-ui/types/date-picker';
import { ElCascader } from 'element-ui/types/cascader';

export declare namespace HCondition {
    interface WrapperProps extends CoreCondition.WrapperProps {
        renderBtn?: boolean;
    }

    /** 条件声明集合 */
    type Condition =
        | CoreCondition.DeepMaybeRef<SelectProps>
        | CoreCondition.DeepMaybeRef<InputProps>
        | CoreCondition.DeepMaybeRef<DatepickerProps>
        | CoreCondition.DeepMaybeRef<CascaderProps>;

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
    interface CascaderProps extends CoreCondition.CascaderProps, Partial<Omit<ElCascader, 'disabled' | 'options'>> {
        t: 'cascader';
    }

    /** 获取 vue 组件的 props 值 */
    type Props<T extends Record<'$props', any>> = Partial<Writeable<T['$props']>>;

    /** 将数据改为可写 */
    type Writeable<T> = {
        -readonly [K in keyof T]: T[K];
    };
}

// 不能直接用 vue-demi 的 ExtractPropTypes, 编译后项目会找不到该类型
// import { ExtractPropTypes } from 'vue-demi';
import { wrapperProps, selectProps, inputProps, datepickerProps, cascaderProps } from './common/props';

export declare namespace CoreCondition {
    type BuiltInField = 'field' | 'query';

    interface WrapperProps extends Omit<ExtractPropTypes<typeof wrapperProps>, BuiltInField> {}
    interface SelectProps extends Omit<ExtractPropTypes<typeof selectProps>, BuiltInField> {}
    interface InputProps extends Omit<ExtractPropTypes<typeof inputProps>, BuiltInField> {}
    interface DatepickerProps extends Omit<ExtractPropTypes<typeof datepickerProps>, BuiltInField> {}
    interface CascaderProps extends Omit<ExtractPropTypes<typeof cascaderProps>, BuiltInField> {}
}

type ExtractPropTypes<O> = {
    [K in keyof Pick<O, RequiredKeys<O>>]: InferPropType<O[K]>;
} & {
    [K in keyof Pick<O, OptionalKeys<O>>]?: InferPropType<O[K]>;
};

type RequiredKeys<T> = {
    [K in keyof T]: T[K] extends
        | { required: true }
        // | { default: any }
        | BooleanConstructor
        | { type: BooleanConstructor }
        ? K
        : never;
}[keyof T];

type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>;

type InferPropType<T> = T extends null
    ? any
    : T extends { type: null | true }
    ? any
    : T extends ObjectConstructor | { type: ObjectConstructor }
    ? Record<string, any>
    : T extends BooleanConstructor | { type: BooleanConstructor }
    ? boolean
    : T extends DateConstructor | { type: DateConstructor }
    ? Date
    : T extends FunctionConstructor
    ? Function
    : T extends Prop<infer V, infer D>
    ? unknown extends V
        ? D extends null | undefined
            ? V
            : D
        : ExtractCorrectPropType<V>
    : T;
type Prop<T, D = T> = PropOptions<T, D> | PropType<T>;
type DefaultFactory<T> = () => T | null | undefined;
interface PropOptions<T = any, D = T> {
    type?: PropType<T> | true | null;
    required?: boolean;
    default?: D | DefaultFactory<D> | null | undefined | object;
    validator?(value: unknown): boolean;
}
type PropType<T> = PropConstructor<T> | PropConstructor<T>[];
type PropConstructor<T> =
    | { (): T }
    | { new (...args: never[]): T & object }
    | { new (...args: any[]): T & object }
    | { new (...args: string[]): Function };
type ExtractCorrectPropType<T> = T extends Function ? ExtractFunctionPropType<T> : Exclude<T, Function>;
type ExtractFunctionPropType<T extends Function, TArgs extends Array<any> = any[], TResult = any> = T extends (
    ...args: TArgs
) => TResult
    ? T
    : never;

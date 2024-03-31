// 不能直接用 vue-demi 的 ExtractPropTypes, 编译后项目会找不到该类型
import { ExtractPropTypes, Ref, UnwrapRef } from 'vue-demi';
import { wrapperProps, plainProps, treeProps } from './use/index';

export declare namespace CoreCondition {
    type BuiltInField = 'field' | 'query';

    /** 将值改为原始值或引用值 */
    type MaybeRef<T> = T | Ref<T>;
    /** 将整个集合改为原始值或引用值 */
    type DeepMaybeRef<T> = T extends Ref<infer V>
        ? MaybeRef<V>
        : T extends (...args: any) => any
        ? MaybeRef<T>
        : T extends Array<any> | Record<string, any>
        ? { [K in keyof T]: DeepMaybeRef<T[K]> }
        : MaybeRef<T>;
    /** 获取实际值(去除 ref 引用) */
    type ToRaw<T> = UnwrapRef<T>;

    interface WrapperProps extends Omit<ExtractPropTypes<OmitDefaultKey<typeof wrapperProps>>, BuiltInField> {}
    interface PlainProps extends Omit<ExtractPropTypes<OmitDefaultKey<typeof plainProps>>, BuiltInField> {}
    interface TreeProps extends Omit<ExtractPropTypes<OmitDefaultKey<typeof treeProps>>, BuiltInField> {}

    type OmitDefaultKey<T> = T extends Record<string | symbol, any>
        ? {
              [K in keyof T]: T[K] extends { default: any } ? Omit<T[K], 'default'> : T[K];
          }
        : T;
}

// type ExtractPropTypes<O> = {
//     [K in keyof Pick<O, RequiredKeys<O>>]: InferPropType<O[K]>;
// } & {
//     [K in keyof Pick<O, OptionalKeys<O>>]?: InferPropType<O[K]>;
// };

// type RequiredKeys<T> = {
//     [K in keyof T]: T[K] extends
//         | { required: true }
//         // | { default: any }
//         | BooleanConstructor
//         | { type: BooleanConstructor }
//         ? K
//         : never;
// }[keyof T];

// type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>;

// type InferPropType<T> = T extends null
//     ? any
//     : T extends { type: null | true }
//     ? any
//     : T extends ObjectConstructor | { type: ObjectConstructor }
//     ? Record<string, any>
//     : T extends BooleanConstructor | { type: BooleanConstructor }
//     ? boolean
//     : T extends DateConstructor | { type: DateConstructor }
//     ? Date
//     : T extends FunctionConstructor
//     ? Function
//     : T extends Prop<infer V, infer D>
//     ? unknown extends V
//         ? D extends null | undefined
//             ? V
//             : D
//         : ExtractCorrectPropType<V>
//     : T;
// type Prop<T, D = T> = PropOptions<T, D> | PropType<T>;
// type DefaultFactory<T> = () => T | null | undefined;
// interface PropOptions<T = any, D = T> {
//     type?: PropType<T> | true | null;
//     required?: boolean;
//     default?: D | DefaultFactory<D> | null | undefined | object;
//     validator?(value: unknown): boolean;
// }
// type PropType<T> = PropConstructor<T> | PropConstructor<T>[];
// type PropConstructor<T> =
//     | { (): T }
//     | { new (...args: never[]): T & object }
//     | { new (...args: any[]): T & object }
//     | { new (...args: string[]): Function };
// type ExtractCorrectPropType<T> = T extends Function ? ExtractFunctionPropType<T> : Exclude<T, Function>;
// type ExtractFunctionPropType<T extends Function, TArgs extends Array<any> = any[], TResult = any> = T extends (
//     ...args: TArgs
// ) => TResult
//     ? T
//     : never;

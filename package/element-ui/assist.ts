import { UnwrapNestedRefs, reactive } from 'vue-demi';
import { HCondition } from './interface';

export function defineCondition<T extends Record<string, HCondition.Condition | false | 0 | undefined>>(
    config: T,
): UnwrapNestedRefs<T> {
    return reactive(config);
}

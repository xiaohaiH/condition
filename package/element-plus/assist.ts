import type { UnwrapNestedRefs } from 'vue';
import { reactive } from 'vue';
import type { HCondition } from './interface';

export type DefineCondition<T = HCondition.Condition> = Record<string, T>;
export function defineCondition<T extends DefineCondition<HCondition.Condition | false | 0 | undefined>>(
    config: T,
): UnwrapNestedRefs<T> {
    return reactive(config);
}

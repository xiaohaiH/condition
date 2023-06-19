import { reactive } from 'vue';
import { HCondition } from './interface';

export function defineCondition<T extends Record<string, HCondition.Condition | false | undefined>>(config: T): T {
    return reactive(config) as unknown as T;
}

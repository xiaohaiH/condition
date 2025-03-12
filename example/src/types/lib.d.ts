import type * as Condition from '@xiaohaih/condition-el-plus';
import type { ElMessage } from 'element-plus';
import type * as Vue from 'vue';

declare module 'virtual:package';

declare global {
    interface Window {
        Vue: typeof Vue & { set: (a: any, b: string, c: any) => void };
        HCondition: typeof Condition;
        Ui: { toast: typeof ElMessage };
    }
}

import * as Vue from 'vue';
import * as Condition from '@xiaohaih/condition-el-plus';
import { ElMessage } from 'element-plus';

declare module 'virtual:package';

declare global {
    interface Window {
        Vue: typeof Vue & { set: (a: any, b: string, c: any) => void };
        HCondition: typeof Condition;
        Ui: { toast: typeof ElMessage };
    }
}

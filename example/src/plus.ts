import * as condition from '@xiaohaih/condition-el-plus';
import { ElMessage } from 'element-plus';
import * as Vue from 'vue';

// @ts-expect-error 忽视挂载声明
window.Vue = { ...Vue };
window.Vue.set = (a, b, c) => a[b] = c;
window.HCondition = condition;

window.Ui = { toast: ElMessage };

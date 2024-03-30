// 防止符号链接导致的报错
// https://github.com/microsoft/TypeScript/issues/42873
// https://juejin.cn/post/7282606413842415675
// @ts-ignore
import { ref } from '@vue/composition-api';
export { provideKey, type ProvideValue } from '@xiaohaih/condition-core';
export * from './package/index';
export * from './assist';
export * from './interface';

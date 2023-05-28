## 条件校验 - `element-ui` 版本

> -   基于 `@xiaohaih/condition-core` 实现的条件校验
> -   提供了 `defineCondition` 函数来做 `ts` 提示
> -   提供了 `registerComponent` 函数来注册自定义的组件, `unregisterComponent` 函数来删除自定义的组件
> -   使用示例
>
> ```html
> <template>
>     <HWrapper :datum="conditions" :backfill="query" @search="log('搜索事件', $event)"></HWrapper>
> </template>
> ```
>
> ```js
> import { HWrapper, defineCondition } from '@xiaohaih/condition-el';
>
> const conditions = () =>
>     defineCondition({
>         name: { t: 'input', placeholder: '名称搜索' },
>         address: { t: 'input', placeholder: '地址搜索' },
>     });
>
> export default {
>     components: {
>         HWrapper,
>     },
>     data: () => ({
>         conditions: conditions(),
>         query: { name: '名称存在默认值' },
>         log: console.log,
>     }),
> };
> ```

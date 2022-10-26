### `input` 组件(输入框组件)

> ---
>
> -   **子条件共有的 `props`**
>
> | 属性名              |                  类型                  | 默认值 | 必填 | 描述                                                             |
> | :------------------ | :------------------------------------: | :----: | :--: | :--------------------------------------------------------------- |
> | field               |                 string                 |   -    |  是  | 提交的字段名                                                     |
> | as                  |                 string                 |   -    |  -   | 提交的字段名(优先级比 `field` 高)                                |
> | emptyValue          |        string\|null\|undefined         |   -    |  -   | 空值时提交的值                                                   |
> | resetToInitialValue |                boolean                 |   -    |  -   | 重置时是否置为初始值                                             |
> | disabled            |  boolean\|(query: object) => boolean   |   -    |  -   | 禁用, 可动态设置                                                 |
> | hide                |  boolean\|(query: object) => boolean   |   -    |  -   | 隐藏                                                             |
> | validator           | (query: object) => any \| Promise<any> |   -    |  -   | 校验函数, 返回非空字符串代表失败, 触发 wrapper 提供的 toast 函数 |
>
> -   **子组件通过父级注入的对象内的方法 `register` 来主动注册条件(子组件都需提供的信息)**
>
> | 属性名             |          类型           | 返回值   | 描述                      |
> | :----------------- | :---------------------: | :------- | ------------------------- |
> | reset              |        Function         | 返回自身 | 重置 query 中的值         |
> | updateWrapperQuery |        Function         | 返回自身 | 更新父级 query 中的值     |
> | validator          | (query: object) => void | any      | 校验自身值是否通过校验    |
> | getQuery           |      () => object       | object   | 获取组件自身的 query 参数 |
>
> -   **`props`**
>
> | 属性名   |  类型   | 默认值 | 必填 | 描述                 |
> | :------- | :-----: | :----: | :--: | :------------------- |
> | realtime | boolean |   -    |  -   | 是否实时触发         |
> | waitTime | boolean |   -    |  -   | 实时触发时的防抖时间 |
>
> ---

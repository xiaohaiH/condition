### `wrapper` 组件(容器组件)

> ---
>
> -   **`props`**
>
> | 属性名              |         类型          | 默认值 | 必填 | 描述                                    |
> | :------------------ | :-------------------: | :----: | :--: | :-------------------------------------- |
> | tag                 |   string \| object    |  div   |  否  | 显示的标签                              |
> | resetToInitialValue |        boolean        |   -    |  否  | 触发重置时是否设为初始值                |
> | datum               |         定义          |   -    |  时  | 渲染的条件, 需外部通过 `t` 渲染具体组件 |
> | backfill            |        object         |   -    |  -   | 条件需要回填需提供                      |
> | realtime            |        boolean        |   -    |  -   | 是否在条件项发生更改后立马触发搜索事件  |
> | immediateSearch     |        boolean        |   -    |  -   | 初始是否需要触发一次 `ready` 事件       |
> | toast               | (msg: string) => void |   -    |  -   | 校验时不合格时触发                      |
>
> -   **`emits`**
>
> | 事件名 |         返回值          | 描述                                                                   |
> | :----- | :---------------------: | :--------------------------------------------------------------------- |
> | ready  | (query: object) => void | 初始化事件(需设置 `immediateSearch` 为 `true`), 第一个参数是搜索值对象 |
> | search | (query: object) => void | 搜索事件, 第一个参数是搜索值对象                                       |
>
> -   **`provide`**
> -   注入键名为 `condition-wrapper`, 注入值是一个对象, 对象暴露了以下内容 👇
>     | 属性名 |类型| 返回值 | 描述 |
>     | :----- |-| :----------------------------------: | :--------------------------------------------------------------------- |
>     | realtime |Ref<boolean>| - | 当前组件是否是实时触发 |
>     | register |(config: CommonMethod)| () => void | 注册条件, 返回一个函数(unregister) |
>     | updateQueryValue |(field: string, value: any)| 返回自身对象 | 更新 query 中搜索的值, 不触发搜索事件 |
>     | insetSearch |Function| 返回自身对象 | 子组件内部值发生了变动, 由父级决定是否触发搜索事件(实时搜索时需要区分这两种方式) |
>     | search |Function| -| 直接触发搜索事件() |
>
> ---

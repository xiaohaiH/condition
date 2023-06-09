### `cascader` 组件(级联组件)

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
> | 属性名       |                         类型                          |  默认值  | 必填 | 描述                                             |
> | :----------- | :---------------------------------------------------: | :------: | :--: | :----------------------------------------------- |
> | fields       |                       string[]                        |    -     |  -   | 不同层级用不同字段时需提供                       |
> | valueKey     |                        string                         |    -     |  是  | 唯一键名                                         |
> | childrenKey  |                        string                         | children |  -   | 子级键名                                         |
> | emitPath     |                        boolean                        |    -     |  -   | 是否返回选中项, 不返回选中项的父级链(数组形式)   |
> | options      |                       object[]                        |    -     |  -   | 下拉选项的数据源, 可通过(getOptions)选项动态获取 |
> | depend       |                        boolean                        |    -     |  -   | getOptions 是否依赖了其它数据                    |
> | dependFields |                   string\|string[]                    |    -     |  -   | 依赖的字段集合                                   |
> | getOptions   | (cb: (data: object[]) => void, query: object) => void |    -     |  -   | 动态获取数据源                                   |
>
> ---
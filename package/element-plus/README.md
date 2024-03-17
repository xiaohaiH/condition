> ## 基于 `element-plus` 实现的条件搜索组件
>
> -   通过 `JSON` 配置, 可动态显隐条件, 可实现相互依赖的条件
> -   目前支持以下几种类型, 通过字段 `t` 来区分
>     -   `input` 文本输入框
>     -   `select` 下拉框
>     -   `datepicker` 日期选择
>     -   `cascader` 级联组件
>     -   `checkbox` 多选框
>     -   `radio` 单选框
> -   提供了 `defineCondition` 函数来定义条件(支持 `ts` 提示)
> -   提供了 `registerComponent` 方法来注册自定义条件组件, `unregisterComponent` 删除自定义的组件
> -   使用示例
>
> ```html
> <template>
>     <HWrapper
>         :datum="conditions"
>         :backfill="query"
>         @search="log('搜索事件', $event)"
>         @reset="log('重置事件', $event)"
>     ></HWrapper>
> </template>
> ```
>
> ```html
> <script lang="ts">
> ```
>
> ```ts
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
>
> ```html
> </script>
> ```
>
> 不同类型支持的属性如下 👇
>
> ## `input`
>
> `tips: ` 支持 [`element-plus`.`input`](https://element-plus.gitee.io/zh-CN/component/input.html#api) 所有属性
>
> | 属性名              | 是否必填 | 类型                                                                           | 描述                       | 默认值    |
> | ------------------- | -------- | ------------------------------------------------------------------------------ | -------------------------- | --------- |
> | realtime            | 否       | boolean                                                                        | 值改变时是否立即触发事件   | -         |
> | waitTime            | 否       | number                                                                         | 实时触发事件的防抖动时长   | 300       |
> | labelSuffix         | 否       | VNode \| string \| Function                                                    | 条件与名称的分隔符         | -         |
> | postfix             | 否       | VNode \| string \| Function                                                    | 条件后显示的文字           | -         |
> | filterable          | 否       | boolean                                                                        | 是否可筛选                 | true      |
> | filterMethod        | 否       | (val: string, item: 选项值) => boolean                                         | 自定义筛选逻辑             | -         |
> | clearable           | 否       | boolean                                                                        | 是否可清空                 | true      |
> | as                  | 否       | string                                                                         | 字段别名(提交时优先该字段) | -         |
> | emptyValue          | 否       | string                                                                         | 值为空时提交的值           | undefined |
> | resetToInitialValue | 否       | string                                                                         | 重置时是否置为初始值       | false     |
> | disabled            | 否       | boolean \| (obj: { query: object, backfill: object }) => boolean               | 是否禁用该条件             | -         |
> | hide                | 否       | boolean \| (obj: { query: object, backfill: object }) => boolean               | 是否隐藏该条件             | -         |
> | validator           | 否       | (query: object) => string \| Promise<string> \| void                           | 校验该属性是否合格         | -         |
> | defaultValue        | 否       | string \| string[] \| (query: object, backfill?: object) => string \| string[] | 默认值                     | -         |
> | depend              | 否       | boolean                                                                        | 是否依赖其它字段           | -         |
> | dependFields        | 否       | string \| string[]                                                             | 依赖的字段集合             | -         |
>
> ## `select`
>
> `tips: ` 支持 [`element-plus`.`select`](https://element-plus.gitee.io/zh-CN/component/select.html#select-api) 所有属性
>
> | 属性名              | 是否必填 | 类型                                                                           | 描述                           | 默认值    |
> | ------------------- | -------- | ------------------------------------------------------------------------------ | ------------------------------ | --------- |
> | labelKey            | 是       | string                                                                         | 选项的标签                     | -         |
> | valueKey            | 是       | string                                                                         | 选项的值                       | -         |
> | options             | 是       | any[]                                                                          | 提供的数据源                   | -         |
> | getOptions          | 否       | (cb: (data: any[], query: object) => void) => void                             | 获取远程数据源                 | -         |
> | label               | 否       | VNode \| string \| Function                                                    | 显示在条件前的名称             | -         |
> | labelSuffix         | 否       | VNode \| string \| Function                                                    | 条件与名称的分隔符             | -         |
> | postfix             | 否       | VNode \| string \| Function                                                    | 条件后显示的文字               | -         |
> | filterable          | 否       | boolean                                                                        | 是否可筛选                     | true      |
> | filterMethod        | 否       | (val: string, item: 选项值) => boolean                                         | 自定义筛选逻辑                 | -         |
> | clearable           | 否       | boolean                                                                        | 是否可清空                     | true      |
> | as                  | 否       | string                                                                         | 提交字段的别名(优先使用该字段) | -         |
> | emptyValue          | 否       | string                                                                         | 值为空时提交的值               | undefined |
> | resetToInitialValue | 否       | string                                                                         | 重置时是否置为初始值           | false     |
> | disabled            | 否       | boolean \| (obj: { query: object, backfill: object }) => boolean               | 是否禁用该条件                 | -         |
> | hide                | 否       | boolean \| (obj: { query: object, backfill: object }) => boolean               | 是否隐藏该条件                 | -         |
> | validator           | 否       | (query: object) => string \| Promise<string> \| void                           | 校验该属性是否合格             | -         |
> | defaultValue        | 否       | string \| string[] \| (query: object, backfill?: object) => string \| string[] | 默认值                         | -         |
> | depend              | 否       | boolean                                                                        | 是否依赖其它字段               | -         |
> | dependFields        | 否       | string \| string[]                                                             | 依赖的字段集合                 | -         |
>
> ## `datepicker`
>
> `tips: ` 支持 [`element-plus`.`datePicker`](https://element-plus.gitee.io/zh-CN/component/date-picker.html#api) 所有属性
>
> | 属性名              | 是否必填 | 类型                                                                           | 描述                             | 默认值     |
> | ------------------- | -------- | ------------------------------------------------------------------------------ | -------------------------------- | ---------- |
> | valueFormat         | 否       | string                                                                         | 日期格式                         | YYYY-MM-DD |
> | fields              | 否       | string[] \| [begin: number, end: number]                                       | 日期范围选择时对应多个字段时使用 | -          |
> | label               | 否       | VNode \| string \| Function                                                    | 显示在条件前的名称               | -          |
> | labelSuffix         | 否       | VNode \| string \| Function                                                    | 条件与名称的分隔符               | -          |
> | postfix             | 否       | VNode \| string \| Function                                                    | 条件后显示的文字                 | -          |
> | filterable          | 否       | boolean                                                                        | 是否可筛选                       | true       |
> | filterMethod        | 否       | (val: string, item: 选项值) => boolean                                         | 自定义筛选逻辑                   | -          |
> | clearable           | 否       | boolean                                                                        | 是否可清空                       | true       |
> | as                  | 否       | string                                                                         | 提交字段的别名(优先使用该字段)   | -          |
> | emptyValue          | 否       | string                                                                         | 值为空时提交的值                 | undefined  |
> | resetToInitialValue | 否       | string                                                                         | 重置时是否置为初始值             | false      |
> | disabled            | 否       | boolean \| (obj: { query: object, backfill: object }) => boolean               | 是否禁用该条件                   | -          |
> | hide                | 否       | boolean \| (obj: { query: object, backfill: object }) => boolean               | 是否隐藏该条件                   | -          |
> | validator           | 否       | (query: object) => string \| Promise<string> \| void                           | 校验该属性是否合格               | -          |
> | defaultValue        | 否       | string \| string[] \| (query: object, backfill?: object) => string \| string[] | 默认值                           | -          |
> | depend              | 否       | boolean                                                                        | 是否依赖其它字段                 | -          |
> | dependFields        | 否       | string \| string[]                                                             | 依赖的字段集合                   | -          |
>
> ## `cascader`
>
> `tips: ` 支持 [`element-plus`.`cascader`](https://element-plus.gitee.io/zh-CN/component/cascader.html#cascader-api) 所有属性
>
> | 属性名              | 是否必填 | 类型                                                                           | 描述                           | 默认值    |
> | ------------------- | -------- | ------------------------------------------------------------------------------ | ------------------------------ | --------- |
> | valueKey            | 是       | string                                                                         | 选项的值                       | -         |
> | childrenKey         | 否       | string                                                                         | 子级 key                       | children  |
> | emitPath            | 否       | boolean                                                                        | 是否以数组格式返回的值         | -         |
> | options             | 是       | any[]                                                                          | 提供的数据源                   | -         |
> | getOptions          | 否       | (cb: (data: any[], query: object) => void) => void                             | 获取远程数据源                 | -         |
> | fields              | 否       | string[]                                                                       | 不同层级对应不同的字段         | -         |
> | label               | 否       | VNode \| string \| Function                                                    | 显示在条件前的名称             | -         |
> | labelSuffix         | 否       | VNode \| string \| Function                                                    | 条件与名称的分隔符             | -         |
> | postfix             | 否       | VNode \| string \| Function                                                    | 条件后显示的文字               | -         |
> | filterable          | 否       | boolean                                                                        | 是否可筛选                     | true      |
> | filterMethod        | 否       | (val: string, item: 选项值) => boolean                                         | 自定义筛选逻辑                 | -         |
> | clearable           | 否       | boolean                                                                        | 是否可清空                     | true      |
> | as                  | 否       | string                                                                         | 提交字段的别名(优先使用该字段) | -         |
> | emptyValue          | 否       | string                                                                         | 值为空时提交的值               | undefined |
> | resetToInitialValue | 否       | string                                                                         | 重置时是否置为初始值           | false     |
> | disabled            | 否       | boolean \| (obj: { query: object, backfill: object }) => boolean               | 是否禁用该条件                 | -         |
> | hide                | 否       | boolean \| (obj: { query: object, backfill: object }) => boolean               | 是否隐藏该条件                 | -         |
> | validator           | 否       | (query: object) => string \| Promise<string> \| void                           | 校验该属性是否合格             | -         |
> | defaultValue        | 否       | string \| string[] \| (query: object, backfill?: object) => string \| string[] | 默认值                         | -         |
> | depend              | 否       | boolean                                                                        | 是否依赖其它字段               | -         |
> | dependFields        | 否       | string \| string[]                                                             | 依赖的字段集合                 | -         |
>
> ## `radio`
>
> `tips: ` 支持 [`element-plus`.`radioGroup`](https://element-plus.gitee.io/zh-CN/component/radio.html#radiogroup-api) 所有属性
>
> | 属性名              | 是否必填 | 类型                                                                           | 描述                           | 默认值    |
> | ------------------- | -------- | ------------------------------------------------------------------------------ | ------------------------------ | --------- |
> | valueKey            | 是       | string                                                                         | 选项的值                       | -         |
> | labelKey            | 是       | string                                                                         | 选项的文本内容                 | -         |
> | type                | 否       | radio \| button                                                                | 单选框类型                     | radio     |
> | cancelable          | 否       | boolean                                                                        | 是否可取消                     | -         |
> | options             | 是       | any[]                                                                          | 提供的数据源                   | -         |
> | getOptions          | 否       | (cb: (data: any[], query: object) => void) => void                             | 获取远程数据源                 | -         |
> | fields              | 否       | string[]                                                                       | 不同层级对应不同的字段         | -         |
> | label               | 否       | VNode \| string \| Function                                                    | 显示在条件前的名称             | -         |
> | labelSuffix         | 否       | VNode \| string \| Function                                                    | 条件与名称的分隔符             | -         |
> | postfix             | 否       | VNode \| string \| Function                                                    | 条件后显示的文字               | -         |
> | filterable          | 否       | boolean                                                                        | 是否可筛选                     | true      |
> | filterMethod        | 否       | (val: string, item: 选项值) => boolean                                         | 自定义筛选逻辑                 | -         |
> | clearable           | 否       | boolean                                                                        | 是否可清空                     | true      |
> | as                  | 否       | string                                                                         | 提交字段的别名(优先使用该字段) | -         |
> | emptyValue          | 否       | string                                                                         | 值为空时提交的值               | undefined |
> | resetToInitialValue | 否       | string                                                                         | 重置时是否置为初始值           | false     |
> | disabled            | 否       | boolean \| (obj: { query: object, backfill: object }) => boolean               | 是否禁用该条件                 | -         |
> | hide                | 否       | boolean \| (obj: { query: object, backfill: object }) => boolean               | 是否隐藏该条件                 | -         |
> | validator           | 否       | (query: object) => string \| Promise<string> \| void                           | 校验该属性是否合格             | -         |
> | defaultValue        | 否       | string \| string[] \| (query: object, backfill?: object) => string \| string[] | 默认值                         | -         |
> | depend              | 否       | boolean                                                                        | 是否依赖其它字段               | -         |
> | dependFields        | 否       | string \| string[]                                                             | 依赖的字段集合                 | -         |
>
> ## `checkbox`
>
> `tips: ` 支持 [`element-plus`.`checkbox`](https://element-plus.gitee.io/zh-CN/component/radio.html#checkbox-api) 所有属性
>
> | 属性名              | 是否必填 | 类型                                                                           | 描述                           | 默认值    |
> | ------------------- | -------- | ------------------------------------------------------------------------------ | ------------------------------ | --------- |
> | valueKey            | 是       | string                                                                         | 选项的值                       | -         |
> | labelKey            | 是       | string                                                                         | 选项的文本内容                 | -         |
> | type                | 否       | checkbox \| button                                                             | 单选框类型                     | checkbox  |
> | options             | 是       | any[]                                                                          | 提供的数据源                   | -         |
> | getOptions          | 否       | (cb: (data: any[], query: object) => void) => void                             | 获取远程数据源                 | -         |
> | fields              | 否       | string[]                                                                       | 不同层级对应不同的字段         | -         |
> | label               | 否       | VNode \| string \| Function                                                    | 显示在条件前的名称             | -         |
> | labelSuffix         | 否       | VNode \| string \| Function                                                    | 条件与名称的分隔符             | -         |
> | postfix             | 否       | VNode \| string \| Function                                                    | 条件后显示的文字               | -         |
> | filterable          | 否       | boolean                                                                        | 是否可筛选                     | true      |
> | filterMethod        | 否       | (val: string, item: 选项值) => boolean                                         | 自定义筛选逻辑                 | -         |
> | clearable           | 否       | boolean                                                                        | 是否可清空                     | true      |
> | as                  | 否       | string                                                                         | 提交字段的别名(优先使用该字段) | -         |
> | emptyValue          | 否       | string                                                                         | 值为空时提交的值               | undefined |
> | resetToInitialValue | 否       | string                                                                         | 重置时是否置为初始值           | false     |
> | disabled            | 否       | boolean \| (obj: { query: object, backfill: object }) => boolean               | 是否禁用该条件                 | -         |
> | hide                | 否       | boolean \| (obj: { query: object, backfill: object }) => boolean               | 是否隐藏该条件                 | -         |
> | validator           | 否       | (query: object) => string \| Promise<string> \| void                           | 校验该属性是否合格             | -         |
> | defaultValue        | 否       | string \| string[] \| (query: object, backfill?: object) => string \| string[] | 默认值                         | -         |
> | depend              | 否       | boolean                                                                        | 是否依赖其它字段               | -         |
> | dependFields        | 否       | string \| string[]                                                             | 依赖的字段集合                 | -         |

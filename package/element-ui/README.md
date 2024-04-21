## 基于 `element-ui` 实现的条件搜索, 校验组件(条件之间相互依赖)

-   通过 `JSON` 配置
-   目前支持以下几种类型, 通过字段 `t` 来区分
    -   <a href="#api-input">`input` (文本输入框)</a>
    -   <a href="#api-select">`select` (下拉框)</a>
    -   <a href="#api-date-picker">`datepicker` (日期选择)</a>
    -   <a href="#api-cascader">`cascader` (级联组件)</a>
    -   <a href="#api-radio">`radio` (单选框)</a>
    -   <a href="#api-checkbox">`checkbox` (多选框)</a>

> **[在线`demo`](https://xiaohaih.github.io/condition/index.html)**

> [在线`demo`(备份)](https://xiaohaih.github.io/testaaa/index.html)

<details>
<summary>使用示例(条件形式)</summary>

```vue
<template>
    <HWrapper
        :datum="conditions"
        :backfill="query"
        @search="log('搜索事件', $event)"
        @reset="log('重置事件', $event)"
    ></HWrapper>
</template>

<script lang="ts">
import { HWrapper, defineCondition } from '@xiaohaih/condition-ui';

const conditions = () =>
    defineCondition({
        name: { t: 'input', placeholder: '名称搜索' },
        address: { t: 'input', placeholder: '地址搜索' },
    });

export default {
    components: {
        HWrapper,
    },
    data: () =({
        conditions: conditions(),
        query: { name: '名称存在默认值' },
        log: console.log,
    }),
};
</script>
```

</details>
<details>
<summary>使用示例(表单形式)</summary>

```vue
<template>
    <div>
        <HWrapper
            ref="formRef"
            :datum="formCondition"
            :rules="rules"
            :backfill="query"
            :render-btn="false"
            :realtime="true"
            @search="query = $event"
        ></HWrapper>
        <div style="min-height: 50px; line-height: 50px">{{ query }}</div>
        <ElButton @click="validate">校验</ElButton>
        <ElButton @click="validateField">逐个校验</ElButton>
        <ElButton @click="clearValidate">清空校验</ElButton>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { HWrapper, defineCondition } from '@xiaohaih/condition-ui';

const conditions = () =>
    defineCondition({
        name: { t: 'input', placeholder: '名称搜索' },
        address: { t: 'input', placeholder: '地址搜索' },
    });

export default {
    components: {
        HWrapper,
    },
    setup(props, ctx) {
        const formRef = ref<InstanceType<typeof HWrapper>>();
        const query = ref<Record<string, any>>({
            // 设置默认值
            input1: '1',
            // input2: '2',
            // select1: '1',
            // select2: '22',
            // cas1: 'aa',
            // cas2: 'cas2AA1',
            // datepikcer1: '2024-03-24',
            // datepikcer2: ['2024-03-24', '2024-03-28'],
            // check1: ['check1'],
            // check2: ['che1'],
            // radio1: 'radio1',
            // radio2: 'rad1',
        });
        const formCondition = defineCondition({
            input1: {
                t: 'input',
                label: 'input1',
                placeholder: '哈哈哈',
            },
            input2: {
                t: 'input',
                label: 'input2222',
                placeholder: '666',
                rules: [{ required: true, message: '必填项' }],
            },
            select1: {
                t: 'select',
                label: 'sel1',
                placeholder: '哈哈哈',
                options: [
                    { label: '第一', value: '1' },
                    { label: '第二', value: '2' },
                    { label: '第三', value: '3' },
                ],
            },
            select2: {
                t: 'select',
                label: 'sel2',
                placeholder: 'test',
                labelKey: 'dictLabel',
                valueKey: 'dictValue',
                options: [],
                getOptions(cb) {
                    setTimeout(() => {
                        cb([
                            { dictLabel: '第一一', dictValue: '11' },
                            { dictLabel: '第二二', dictValue: '22' },
                            { dictLabel: '第三三', dictValue: '33' },
                        ]);
                    }, 1000);
                },
                rules: [{ required: true, message: '必填项' }],
            },
            datepikcer1: {
                t: 'datepicker',
                label: 'date1',
                placeholder: 'fff',
                format: 'MM-DD',
                valueFormat: 'YYYY-MM-DD',
            },
            date11: {
                t: 'datepicker',
                type: 'daterange',
                label: 'date2',
                fields: ['date11', 'date22'],
                placeholder: '999',
                startPlaceholder: '起',
                endPlaceholder: '止',
                rules: [{ required: true, message: '必填项' }],
            },
            cas1: {
                t: 'cascader',
                label: 'cas1',
                placeholder: 'fff',
                fields: ['cas1', 'cas1_1'],
                props: { checkStrictly: true },
                options: [
                    {
                        label: 'aa',
                        value: 'aa',
                        children: [
                            { label: 'AA1', value: 'AA1' },
                            { label: 'AA2', value: 'AA2' },
                        ],
                    },
                    {
                        label: 'bb',
                        value: 'bb',
                        children: [
                            { label: 'BB1', value: 'BB1' },
                            { label: 'BB2', value: 'BB2' },
                        ],
                    },
                ],
            },
            cas2: {
                t: 'cascader',
                type: 'daterange',
                label: 'cas2',
                placeholder: '999',
                rules: [{ required: true, message: '必填项' }],
                getOptions(cb) {
                    cb([
                        {
                            label: 'cas2aa',
                            value: 'cas2aa',
                            children: [
                                { label: 'cas2AA1', value: 'cas2AA1' },
                                { label: 'cas2AA2', value: 'cas2AA2' },
                            ],
                        },
                        {
                            label: 'cas2bb',
                            value: 'cas2bb',
                            children: [
                                { label: 'cas2BB1', value: 'cas2BB1' },
                                { label: 'cas2BB2', value: 'cas2BB2' },
                            ],
                        },
                    ]);
                },
            },
            check1: {
                t: 'checkbox',
                label: 'check1',
                placeholder: 'ddd',
                type: 'button',
                options: [
                    { label: 'check1', value: 'check1' },
                    { label: 'check2', value: 'check2' },
                ],
            },
            check2: {
                t: 'checkbox',
                label: 'check2',
                placeholder: 'ddd',
                rules: [{ required: true, message: '必填项' }],
                getOptions(cb) {
                    setTimeout(() => {
                        cb([
                            { label: 'che1', value: 'che1' },
                            { label: 'che2', value: 'che2' },
                        ]);
                    }, 1000);
                },
            },
            radio1: {
                t: 'radio',
                label: 'radio1',
                placeholder: 'ddd',
                type: 'button',
                options: [
                    { label: 'radio1', value: 'radio1' },
                    { label: 'radio2', value: 'radio2' },
                ],
            },
            radio2: {
                t: 'radio',
                label: 'radio2-cancelable',
                placeholder: 'ddd',
                rules: [{ required: true, message: '必填项' }],
                cancelable: true,
                getOptions(cb) {
                    setTimeout(() => {
                        cb([
                            { label: 'rad1', value: 'rad1' },
                            { label: 'rad2', value: 'rad2' },
                        ]);
                    }, 1000);
                },
            },
        });
        const rules = {
            input1: [{ required: true, message: 'formRules' }],
            input2: [
                {
                    validator: (rule: any, val: string, cb: (arg?: any) => void) =>
                        val !== '123' ? cb('not 123 from formRules') : cb(),
                    message: 'not 123 from formRules',
                },
            ],
            select1: [{ required: true, message: 'select form FormRules' }],
            datepikcer1: [{ required: true, message: 'datepicker form FormRules' }],
            cas1: [{ required: true, message: 'cascader form FormRules' }],
            check1: [{ required: true, message: 'check form FormRules' }],
            radio1: [{ required: true, message: 'radio form FormRules' }],
        };
        const keys = Object.keys(forms);
        let idx = 0;
        function validate() {
            formRef.value?.formRef?.validate();
        }
        function validateField() {
            clearValidate();
            formRef.value?.formRef?.validateField(keys[idx % keys.length]);
            idx = (idx + 1) % keys.length;
        }
        function clearValidate() {
            formRef.value?.formRef?.clearValidate();
        }

        return {
            formRef,
            query,
            formCondition,
            rules,
            validate,
            validateField,
            clearValidate,
        };
    },
};
</script>
```

</details>

> -   TODO
>     -   文件上传
>     -   虚拟列表下拉框

<details>
<summary><strong><a id="wrapper-attrs" href="#wrapper-attrs">容器Props</a></strong></summary>

`tips: ` 支持 [`element-ui.Form`](https://element-ui.gitee.io/zh-CN/component/form.html#form-api) 所有 `props`(`model` 属性除外)
| 属性名 | 是否必填 | 类型 | 描述 | 默认值 |
| --------- | -------- | ------- | ------------------------ | ------ |
| datum | 是 | object | 条件数据源 | - |
| realtime | 否 | boolean | 是否实时触发搜索事件(值发生改变时) | - |
| backfill | 否 | object | 回填信息(使条件内部值与该对象的值保持一致) | - |
| toast | 否 | (msg: string) => void | 校验失败时产生的提示(与属性 `validator` 配合使用) | - |
| searchAtDatumChanged | 否 | boolean | 是否在数据源发生改变后触发搜索事件 | - |
| resetToInitialValue | 否 | boolean | 重置时是否置为初始值 | - |
| immediateSearch | 否 | boolean | 初始是否触发搜索事件来返回当前的 `query` | - |
| renderBtn | 否 | boolean | 是否渲染搜索重置按钮 | true |
| resetTriggerSearch | 否 | boolean | 重置时触发搜索事件 | - |
| searchText | 否 | string | 搜索按钮文字 | 搜索 |
| resetText | 否 | string | 重置按钮文字 | 重置 |
| rules | 否 | object\|object[] | Form.rules props | - |

</details>

<details>
<summary>
<strong><a id="common-attrs" href="#common-attrs">公共属性</a></strong>
</summary>

`tips: ` 支持[`element-ui.FormItem`](https://element-ui.gitee.io/zh-CN/component/form.html#formitem-api) 所有 `props`

> | 属性名              | 是否必填 | 类型                                                                         | 描述                                   | 默认值    |
> | ------------------- | -------- | ---------------------------------------------------------------------------- | -------------------------------------- | --------- |
> | label               | 否       | string                                                                       | formItem.label 属性                    | -         |
> | rules               | 否       | object\|object[]                                                             | formItem.rules 属性                    | -         |
> | postfix             | 否       | VNode \| string \| Function                                                  | 条件间的分隔符                         | -         |
> | emptyValue          | 否       | string                                                                       | 值为空时提交的值                       | undefined |
> | resetToInitialValue | 否       | string                                                                       | 重置时是否置为初始值                   | false     |
> | disabled            | 否       | boolean \| (obj: { query: object, backfill: object }) =boolean               | 是否禁用该条件                         | -         |
> | hide                | 否       | boolean \| (obj: { query: object, backfill: object }) =boolean               | 是否隐藏该条件                         | -         |
> | validator           | 否       | (query: object) =string \| Promise<string\| void                             | 校验该属性是否合格(不合格应返回字符串) | -         |
> | defaultValue        | 否       | string \| string[] \| (query: object, backfill?: object) =string \| string[] | 默认值                                 | -         |
> | depend              | 否       | boolean                                                                      | 是否依赖其它字段                       | -         |
> | dependFields        | 否       | string \| string[]                                                           | 依赖的字段集合                         | -         |

</details>

## <span id="api-input">`input.props`</span>

> `tips: ` 支持 [`element-ui.input`](https://element.eleme.cn/#/zh-CN/component/input#input-attributes) 所有 `props`
>
> | 属性名      | 是否必填 | 类型                                                                  | 描述                                                                                          | 默认值 |
> | ----------- | -------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------ |
> | realtime    | 否       | boolean                                                               | 是否实时触发搜索事件(当 `wrapper.realtime` 为 `true` 时, 可将该值设为 `false` 并设置抖动时间) | true   |
> | waitTime    | 否       | number                                                                | 实时触发事件的防抖动时长                                                                      | 300    |
> | clearable   | 否       | boolean                                                               | 是否可清空                                                                                    | true   |
> | slotPrefix  | 否       | VNode \| (option: { query, backfill, search, insideSearch }) => VNode | `input.prefix`插槽(search 触发外部搜索, insideSearch 触发内部搜索)                            | -      |
> | slotSuffix  | 否       | VNode \| (option: { query, backfill, search, insideSearch }) => VNode | `input.suffix`插槽                                                                            | -      |
> | slotPrepend | 否       | VNode \| (option: { query, backfill, search, insideSearch }) => VNode | `input.prepend`插槽                                                                           | -      |
> | slotAppend  | 否       | VNode \| (option: { query, backfill, search, insideSearch }) => VNode | `input.append`插槽                                                                            | -      |

## <span id="api-select">`select.props`</span>

> `tips: ` 支持 [`element-ui.select`](https://element.eleme.cn/#/zh-CN/component/select#select-attributes) 所有 `props`
>
> | 属性名       | 是否必填 | 类型                                           | 描述           | 默认值 |
> | ------------ | -------- | ---------------------------------------------- | -------------- | ------ |
> | labelKey     | 否       | string                                         | 选项的标签     | label  |
> | valueKey     | 否       | string                                         | 选项的值       | value  |
> | options      | 否       | any[]                                          | 数据源         | -      |
> | getOptions   | 否       | (cb: (data: any[], query: object) =void) =void | 异步设置数据源 | -      |
> | filterable   | 否       | boolean                                        | 是否可筛选     | true   |
> | filterMethod | 否       | (val: string, item: 选项值) =boolean           | 自定义筛选逻辑 | -      |
> | clearable    | 否       | boolean                                        | 是否可清空     | true   |

## <span id="api-date-picker">`datepicker.props`</span>

> `tips: ` 支持 [`element-ui.datePicker`](https://element.eleme.cn/#/zh-CN/component/date-picker#attributes) 所有 `props`
>
> | 属性名      | 是否必填 | 类型                                     | 描述                             | 默认值     |
> | ----------- | -------- | ---------------------------------------- | -------------------------------- | ---------- |
> | valueFormat | 否       | string                                   | 日期格式                         | yyyy-MM-dd |
> | fields      | 否       | string[] \| [begin: number, end: number] | 日期范围选择时对应多个字段时使用 | -          |
> | clearable   | 否       | boolean                                  | 是否可清空                       | true       |

## <span id="api-cascader">`cascader.props`</span>

> `tips: ` 支持 [`element-ui.cascader`](https://element.eleme.cn/#/zh-CN/component/cascader#cascader-attributes) 所有 `props`
>
> **注意: 当 `cascader` 是单选时 `cascader.props.emitPath` 默认为 `false`, 此处与官方文档表现不一致**
>
> | 属性名       | 是否必填 | 类型                                           | 描述                   | 默认值   |
> | ------------ | -------- | ---------------------------------------------- | ---------------------- | -------- |
> | valueKey     | 否       | string                                         | 选项的值               | value    |
> | childrenKey  | 否       | string                                         | 子级 key               | children |
> | emitPath     | 否       | boolean                                        | 是否以数组格式返回的值 | -        |
> | options      | 是       | any[]                                          | 数据源                 | -        |
> | getOptions   | 否       | (cb: (data: any[], query: object) =void) =void | 异步设置数据源         | -        |
> | fields       | 否       | string[]                                       | 不同层级对应不同的字段 | -        |
> | filterable   | 否       | boolean                                        | 是否可筛选             | true     |
> | filterMethod | 否       | (val: string, item: 选项值) =boolean           | 自定义筛选逻辑         | -        |
> | clearable    | 否       | boolean                                        | 是否可清空             | true     |

## <span id="api-radio">`radio.props`</span>

> `tips: ` 支持 [`element-ui.radioGroup`](https://element.eleme.cn/#/zh-CN/component/radio#radio-group-attributes) 所有 `props`
>
> | 属性名     | 是否必填 | 类型                                           | 描述           | 默认值 |
> | ---------- | -------- | ---------------------------------------------- | -------------- | ------ |
> | valueKey   | 否       | string                                         | 选项的值       | value  |
> | labelKey   | 否       | string                                         | 选项的文本内容 | label  |
> | type       | 否       | radio \| button                                | 单选框类型     | radio  |
> | cancelable | 否       | boolean                                        | 是否可取消     | -      |
> | options    | 是       | any[]                                          | 数据源         | -      |
> | getOptions | 否       | (cb: (data: any[], query: object) =void) =void | 异步设置数据源 | -      |

## <span id="api-checkbox">`checkbox.props`</span>

> `tips: ` 支持 [`element-ui.checkbox`](https://element.eleme.cn/#/zh-CN/component/checkbox#checkbox-attributes) 所有 `props`
>
> | 属性名     | 是否必填 | 类型                                           | 描述                   | 默认值   |
> | ---------- | -------- | ---------------------------------------------- | ---------------------- | -------- |
> | valueKey   | 否       | string                                         | 选项的值               | value    |
> | labelKey   | 否       | string                                         | 选项的文本内容         | label    |
> | type       | 否       | checkbox \| button                             | 单选框类型             | checkbox |
> | options    | 是       | any[]                                          | 数据源                 | -        |
> | getOptions | 否       | (cb: (data: any[], query: object) =void) =void | 异步设置数据源         | -        |
> | fields     | 否       | string[]                                       | 不同层级对应不同的字段 | -        |

## <span id="api-color-picker">`color-picker.props`</span>

> `tips: ` 支持 [`element-ui.color-picker`](https://element.eleme.cn/#/zh-CN/component/color-picker#attributes) 所有 `props`

## <span id="api-input-number">`input-number.props`</span>

> `tips: ` 支持 [`element-ui.input-number`](https://element.eleme.cn/#/zh-CN/component/input-number#attributes) 所有 `props`
>
> | 属性名   | 是否必填 | 类型    | 描述                                                                                          | 默认值 |
> | -------- | -------- | ------- | --------------------------------------------------------------------------------------------- | ------ |
> | realtime | 否       | boolean | 是否实时触发搜索事件(当 `wrapper.realtime` 为 `true` 时, 可将该值设为 `false` 并设置抖动时间) | true   |
> | waitTime | 否       | number  | 实时触发事件的防抖动时长                                                                      | 300    |

## <span id="api-rate">`rate.props`</span>

> `tips: ` 支持 [`element-ui.rate`](https://element.eleme.cn/#/zh-CN/component/rate#attributes) 所有 `props`

## <span id="api-slider">`slider.props`</span>

> `tips: ` 支持 [`element-ui.slider`](https://element.eleme.cn/#/zh-CN/component/slider#attributes) 所有 `props`

## <span id="api-switch">`switch.props`</span>

> `tips: ` 支持 [`element-ui.switch`](https://element.eleme.cn/#/zh-CN/component/switch#attributes) 所有 `props`

## <span id="api-time-picker">`time-picker.props`</span>

> `tips: ` 支持 [`element-ui.time-picker`](https://element.eleme.cn/#/zh-CN/component/time-picker#attributes) 所有 `props`
>
> | 属性名      | 是否必填 | 类型     | 描述                   | 默认值   |
> | ----------- | -------- | -------- | ---------------------- | -------- |
> | fields      | 否       | string[] | 不同下标对应不同的字段 | -        |
> | valueFormat | 否       | string   | 时间格式               | HH:mm:ss |

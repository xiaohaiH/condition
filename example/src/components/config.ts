import { set } from 'vue-demi';

export const conditionFactory = () => [
    {
        name: 'base',
        title: '基础用法',
        description: '',
        condition: {
            a: {
                t: 'input',
                clearable: true,
                placeholder: '输入框搜索',
            },
            b: {
                t: 'select',
                placeholder: '下拉框搜索',
                // disabled: false,
                disabled: (query: Record<string, any>) => !!query.a,
                valueKey: 'dictValue',
                labelKey: 'dictLabel',
                size: 'mini',
                option: [
                    { dictValue: '1', dictLabel: '选项一' },
                    { dictValue: '2', dictLabel: '选项二' },
                    { dictValue: 'example', dictLabel: '选项三' },
                ],
            },
            c: {
                t: 'datepicker',
                placeholder: '日期选择',
                size: 'mini',
            },
            d: {
                t: 'datepicker',
                placeholder: '日期区间选择',
                size: 'mini',
                beginField: 'startTime',
                endField: 'endTime',
            },
            // e: {
            //     t: 'cascader',
            //     placeholder: '级联选择 - 单值',
            //     size: 'mini',
            //     beginField: 'startTime',
            //     endField: 'endTime',
            // },
            // f: {
            //     t: 'cascader',
            //     placeholder: '级联选择 - 多值',
            //     size: 'mini',
            //     beginField: 'startTime',
            //     endField: 'endTime',
            // },
        },
        query: {} as Record<string, any>,
        setQuery(item: any) {
            set(item.query, 'a', '手动设置');
            set(item.query, 'b', '0');
        },
    },
    {
        name: 'input-depend',
        title: 'input 存在依赖',
        description: '',
        condition: {
            a: {
                t: 'input',
                placeholder: '输入框搜索',
            },
            b: {
                t: 'input',
                disabled: (query: Record<string, string>) => !query.a,
                placeholder: '依赖第一个输入框',
            },
            c: {
                t: 'input',
                hide: (query: Record<string, string>) => !query.a,
                placeholder: '依赖第一个输入框',
            },
        },
        query: {} as Record<string, any>,
        setQuery(item: any) {
            set(item.query, 'a', '显身!');
            set(item.query, 'b', '来了~');
        },
    },
];

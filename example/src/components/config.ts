import { set } from 'vue-demi';

export const conditionFactory = () => [
    // {
    //     name: 'base',
    //     title: '基础用法',
    //     description: '',
    //     condition: {
    //         a: {
    //             t: 'input',
    //             clearable: true,
    //             placeholder: '输入框搜索',
    //         },
    //         b: {
    //             t: 'select',
    //             placeholder: '下拉框搜索',
    //             // disabled: false,
    //             disabled: (query: Record<string, any>) => !!query.a,
    //             valueKey: 'dictValue',
    //             labelKey: 'dictLabel',
    //             size: 'mini',
    //             option: [
    //                 { dictValue: '1', dictLabel: '选项一' },
    //                 { dictValue: '2', dictLabel: '选项二' },
    //                 { dictValue: 'example', dictLabel: '选项三' },
    //             ],
    //         },
    //         c: {
    //             t: 'datepicker',
    //             placeholder: '日期选择',
    //             size: 'mini',
    //         },
    //         d: {
    //             t: 'datepicker',
    //             placeholder: '日期区间选择',
    //             size: 'mini',
    //             beginField: 'startTime',
    //             endField: 'endTime',
    //         },
    //         // e: {
    //         //     t: 'cascader',
    //         //     placeholder: '级联选择 - 单值',
    //         //     size: 'mini',
    //         //     beginField: 'startTime',
    //         //     endField: 'endTime',
    //         // },
    //         // f: {
    //         //     t: 'cascader',
    //         //     placeholder: '级联选择 - 多值',
    //         //     size: 'mini',
    //         //     beginField: 'startTime',
    //         //     endField: 'endTime',
    //         // },
    //     },
    //     query: {} as Record<string, any>,
    //     setQuery(item: any) {
    //         set(item.query, 'a', '手动设置');
    //         set(item.query, 'b', '0');
    //     },
    // },
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
        query: { b: '存在默认值', test: '额外值' } as Record<string, any>,
        setQuery(item: any) {
            set(item.query, 'a', '显身!');
            set(item.query, 'b', '来了~');
        },
    },
    {
        name: 'select-depend',
        title: 'select 存在依赖',
        description: '',
        condition: {
            aa: {
                t: 'select',
                placeholder: '下拉框搜索',
                valueKey: 'code',
                labelKey: 'name',
                option: [],
                async getDict(cb: any) {
                    setTimeout(() => {
                        cb([
                            { code: '1', name: '选项一' },
                            { code: '2', name: '选项二' },
                            { code: '3', name: '选项三' },
                            { code: '4', name: '选项四' },
                        ]);
                    }, 2000);
                },
            },
            bb: {
                t: 'select',
                disabled: (query: Record<string, string>) => !query.aa,
                placeholder: '依赖第一个下拉框',
                valueKey: 'code',
                labelKey: 'name',
                option: [
                    { code: '11', name: '选项一11111' },
                    { code: '22', name: '选项二22222' },
                    { code: '33', name: '选项三33333' },
                    { code: '44', name: '选项四44444' },
                ],
            },
            cc: {
                t: 'select',
                hide: (query: Record<string, string>) => !query.aa,
                placeholder: '依赖第一个下拉框',
                valueKey: 'code',
                labelKey: 'name',
                option: [
                    { code: '啊啊', name: '一' },
                    { code: '版本', name: '二' },
                    { code: '插槽', name: '三' },
                    { code: '多大', name: '四' },
                ],
                async getDict(cb: any) {
                    setTimeout(() => {
                        cb([
                            { code: '啊啊', name: '一' },
                            { code: '版本', name: '二' },
                            { code: '插槽', name: '三' },
                            { code: '多大', name: '四' },
                            { code: '啊啊dd', name: '一dd' },
                            { code: '版本dd', name: '二dd' },
                            { code: '插槽dd', name: '三dd' },
                            { code: '多大dd', name: '四dd' },
                        ]);
                    }, 2000);
                },
            },
        },
        query: { test: '额外值' } as Record<string, any>,
        setQuery(item: any) {
            set(item.query, 'aa', '2');
            set(item.query, 'cc', '啊啊');
        },
    },
];

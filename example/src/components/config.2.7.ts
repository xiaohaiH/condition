import { set } from 'vue';
// import { defineCondition } from '@xiaohaih/condition-el';

function defineCondition(v: any) {
    return v;
}

export const conditionFactory = () => [
    {
        name: 'base',
        title: '基础用法',
        description: '',
        condition: {
            a: {
                t: 'input',
                label: '名称搜索',
                clearable: true,
                placeholder: '输入框搜索',
                defaultValue: '666',
            },
            dd: {
                t: 'input',
                label: 'dd搜索',
                clearable: true,
                placeholders: ['起始年龄段', '中层年龄段', '结束年龄段'],
                inputNum: 3,
                inputSuffix: '-',
                fields: ['input-1', 'input-2', 'input-3'],
                defaultValue: () => ['aa', 'bb', 'cc'],
            },
            gg: {
                t: 'radio',
                label: 'gg单选',
                type: 'button',
                valueKey: 'dictValue',
                labelKey: 'dictLabel',
                options: [
                    { dictValue: 'radio-单选1', dictLabel: '单选1' },
                    { dictValue: 'radio-单选二', dictLabel: '单选二' },
                ],
                defaultValue: 'radio-单选1',
            },
            b: {
                t: 'select',
                label: 'b搜索',
                placeholder: '下拉框搜索',
                // disabled: false,
                disabled: (query: Record<string, any>) => !query.a,
                valueKey: 'dictValue',
                labelKey: 'dictLabel',
                options: [],
                defaultValue: '2',
                getOptions(cb, query, option) {
                    setTimeout(() => {
                        cb([
                            { dictValue: '1', dictLabel: '选项一' },
                            { dictValue: '2', dictLabel: '选项二' },
                            { dictValue: 'example', dictLabel: '选项三' },
                        ]);
                        option.trigger === 'initial' && option.search('example');
                    });
                },
            },
            ccc: {
                t: 'select',
                label: 'ccc搜索',
                placeholder: '下拉框搜索',
                // disabled: false,
                valueKey: 'dictValue',
                labelKey: 'dictLabel',
                options: [
                    {
                        dictValue: 'group-1',
                        dictLabel: '分组选项A',
                        group: true,
                        children: [
                            { dictValue: 'group-1-1', dictLabel: '分组一' },
                            { dictValue: 'group-1-2', dictLabel: '分组二' },
                        ],
                    },
                    {
                        dictValue: '222',
                        dictLabel: '分组选项B',
                        group: true,
                        children: [
                            { dictValue: 'group-2-1', dictLabel: 'group-分组一' },
                            { dictValue: 'group-2-2', dictLabel: 'group-分组二' },
                        ],
                    },
                    { dictValue: '2', dictLabel: '选项二' },
                    { dictValue: 'example', dictLabel: '选项三' },
                ],
                defaultValue: () => 'example',
            },
            c: {
                t: 'datepicker',
                placeholder: '日期选择',
                defaultValue: '2023-10-10',
            },
            d: {
                as: 'startTime_endTime',
                t: 'datepicker',
                type: 'daterange',
                placeholder: '日期区间选择',
                size: 'large',
                startPlaceholder: '开始',
                endPlaceholder: '结束',
                beginField: 'startTime',
                endField: 'endTime',
                defaultValue: ['2023-10-08', '2023-10-11'],
            },
            e: {
                t: 'cascader',
                placeholder: '级联选择',
                resetToInitialValue: true,
                valueKey: 'value',
                // fields: ['cascader-a', 'cascader-b'],
                // emitPath: true,
                props: {
                    checkStrictly: true,
                },
                defaultValue: ['2', '2-1'],
                getOptions(cb, query, option) {
                    setTimeout(() => {
                        cb([
                            { label: 'A', value: '1', children: [{ label: 'A-11111', value: '1-1' }] },
                            {
                                label: 'B',
                                value: '2',
                                children: [
                                    { label: 'B-11111', value: '2-1' },
                                    { label: 'B-22222', value: '2-2' },
                                ],
                            },
                            {
                                label: 'C',
                                value: '3',
                                children: [
                                    { label: 'C-11111', value: '3-1' },
                                    { label: 'C-22222', value: '3-2' },
                                    { label: 'C-33333', value: '3-3' },
                                    { label: 'C-44444', value: '3-4' },
                                ],
                            },
                        ]);
                        // option.search(['3', '3-3']);
                    }, 2000);
                },
            },
            // f: {
            //     t: 'cascader',
            //     placeholder: '级联选择 - 多值',
            //     beginField: 'startTime',
            //     endField: 'endTime',
            // },
        },
        condition2: {
            a: {
                t: 'input',
                clearable: true,
                placeholder: '输入框搜索',
            },
            d: {
                t: 'datepicker',
                placeholder: '日期选择',
            },
        },
        query: { e: '1-1', 'cascader-a': '3', 'cascader-b': '3-3' } as Record<string, any>,
        setQuery(item: any) {
            set(item.query, 'a', '手动设置');
            set(item.query, 'b', '1');
            set(item.query, 'dd', (item.query.dd || 0) + 1);
            set(item.query, 'ad', (item.query.ad || 0) + 1);
        },
        setCondition(item: any) {
            if (item.ab) {
                set(item, 'condition', item.condition1);
                item.ab = false;
            } else {
                item.condition1 || (item.condition1 = item.condition);
                set(item, 'condition', item.condition2);
                item.ab = true;
            }
        },
    },
    {
        name: 'input-depend',
        title: 'input 存在依赖',
        description: '',
        resetTriggerSearch: true,
        condition: defineCondition({
            a: {
                t: 'input',
                placeholder: '输入框搜索',
                resetToInitialValue: true,
            },
            b: {
                t: 'input',
                resetToInitialValue: true,
                disabled: (query: Record<string, string>) => !query.a,
                placeholder: '依赖第一个输入框',
            },
            c: {
                t: 'input',
                resetToInitialValue: true,
                hide: (query: Record<string, string>) => !query.a,
                placeholder: '依赖第一个输入框',
            },
            d: {
                t: 'input',
                resetToInitialValue: true,
                depend: true,
                dependFields: ['a', 'b'],
                placeholder: '依赖第一, 二个输入框',
            },
        }),
        query: { b: '存在默认值', d: 'normal', test: '额外值' } as Record<string, any>,
        setQuery(item: any) {
            set(item.query, 'a', '显身!');
            set(item.query, 'b', '来了~');
        },
    },
    {
        name: 'select-depend',
        title: 'select 存在依赖',
        description: '',
        condition: defineCondition({
            aa: {
                t: 'select',
                placeholder: '下拉框搜索',
                valueKey: 'code',
                labelKey: 'name',
                options: [],
                resetToInitialValue: true,
                async getOptions(cb) {
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
                disabled: (query) => !query.aa,
                placeholder: '依赖第一个下拉框',
                valueKey: 'code',
                labelKey: 'name',
                resetToInitialValue: true,
                options: [
                    { code: '11', name: '选项一11111' },
                    { code: '22', name: '选项二22222' },
                    { code: '33', name: '选项三33333' },
                    { code: '44', name: '选项四44444' },
                ],
            },
            cc: {
                t: 'select',
                // hide: (query) => !query.aa,
                placeholder: '依赖第一个下拉框',
                valueKey: 'code',
                labelKey: 'name',
                options: [
                    { code: '啊啊', name: '一' },
                    { code: '版本', name: '二' },
                    { code: '插槽', name: '三' },
                    { code: '多大', name: '四' },
                ],
                resetToInitialValue: true,
                depend: true,
                dependFields: 'bb',
                async getOptions(cb, query) {
                    console.log('select-update');
                    setTimeout(() => {
                        cb(
                            [
                                { code: '啊啊', name: '一' },
                                { code: '版本', name: '二' },
                                { code: '插槽', name: '三' },
                                { code: '多大', name: '四' },
                                { code: '啊啊dd', name: '一dd' },
                                { code: '版本dd', name: '二dd' },
                                { code: '插槽dd', name: '三dd' },
                                { code: '多大dd', name: '四dd' },
                            ].concat(query.bb ? [{ code: 'aaaa', name: 'bb exists' }] : []),
                        );
                    }, 2000);
                },
            },
        }),
        query: { aa: '1', bb: '22', cc: '啊啊', test: '额外值' },
        setQuery(item: any) {
            set(item.query, 'aa', '2');
            set(item.query, 'cc', '啊啊');
        },
    },
    {
        name: 'datepicker-depend',
        title: 'datepicker 存在依赖',
        description: '',
        condition: defineCondition({
            hhh: {
                t: 'datepicker',
                placeholder: '日期选择',
            },
            dddd: {
                t: 'datepicker',
                type: 'daterange',
                disabled: (query) => !query.hhh,
                placeholder: '依赖第一个日期',
                resetToInitialValue: true,
            },
            fffff: {
                t: 'datepicker',
                resetToInitialValue: true,
                // hide: (query) => !query.hhh,
                depend: true,
                dependFields: 'hhh',
                placeholder: '依赖第一个日期',
                startPlaceholder: '开始',
                endPlaceholder: '结束',
                valueFormat: 'yyyy-MM-dd',
            },
            dffds: {
                t: 'datepicker',
                type: 'daterange',
                hide: (query) => !query.dddd,
                placeholder: '依赖第二个日期',
                startPlaceholder: '开始',
                endPlaceholder: '结束',
                valueFormat: 'yyyy-MM-dd',
                beginField: 'tttt',
                endField: 'eeee',
                resetToInitialValue: true,
            },
        }),
        query: {
            hhh: '2024-05-06',
            dddd: ['2022-10-18', '2022-10-28'],
            tttt: '2022-10-18',
            fffff: '2023-01-01',
            eeee: '2022-11-18',
            test: '额外值',
        },
        setQuery(item: any) {
            set(item.query, 'hhh', '1993-02-05');
            set(item.query, 'dddd', '2005-12-12');
        },
    },
    {
        name: 'cascader-depend',
        title: 'cascader 存在依赖',
        description: '',
        condition: defineCondition({
            ac: {
                t: 'cascader',
                placeholder: '级联选择',
                resetToInitialValue: true,
                valueKey: 'value',
                // emitPath: true,
                props: {
                    checkStrictly: true,
                },
                getOptions(cb) {
                    setTimeout(cb, 2000, [
                        { label: 'A', value: '1', children: [{ label: 'A-11111', value: '1-1' }] },
                        {
                            label: 'B',
                            value: '2',
                            children: [
                                { label: 'B-11111', value: '2-1' },
                                { label: 'B-22222', value: '2-2' },
                            ],
                        },
                        {
                            label: 'C',
                            value: '3',
                            children: [
                                { label: 'C-11111', value: '3-1' },
                                { label: 'C-22222', value: '3-2' },
                                { label: 'C-33333', value: '3-3' },
                                { label: 'C-44444', value: '3-4' },
                            ],
                        },
                    ]);
                },
                /* options: [
                    { label: 'A', value: '1', children: [{ label: 'A-11111', value: '1-1' }] },
                    {
                        label: 'B',
                        value: '2',
                        children: [
                            { label: 'B-11111', value: '2-1' },
                            { label: 'B-22222', value: '2-2' },
                        ],
                    },
                    {
                        label: 'C',
                        value: '3',
                        children: [
                            { label: 'C-11111', value: '3-1' },
                            { label: 'C-22222', value: '3-2' },
                            { label: 'C-33333', value: '3-3' },
                            { label: 'C-44444', value: '3-4' },
                        ],
                    },
                ], */
            },
            bc: {
                t: 'cascader',
                placeholder: '级联选择',
                fields: ['level1', 'level2', 'level3'],
                resetToInitialValue: true,
                valueKey: 'value',
                emitPath: true,
                disabled: (query) => !query.ac?.length,
                // hide: (query) => !query.ac?.length,
                options: [
                    { label: 'A', value: 'bc_1', children: [{ label: 'A-11111', value: 'bc_1-1' }] },
                    {
                        label: 'B',
                        value: 'bc_2',
                        children: [
                            { label: 'B-11111', value: 'bc_2-1' },
                            { label: 'B-22222', value: 'bc_2-2' },
                        ],
                    },
                    {
                        label: 'C',
                        value: 'bc_3',
                        children: [
                            { label: 'C-11111', value: 'bc_3-1' },
                            { label: 'C-22222', value: 'bc_3-2' },
                            { label: 'C-33333', value: 'bc_3-3' },
                            { label: 'C-44444', value: 'bc_3-4' },
                        ],
                    },
                ],
            },
            cc: {
                t: 'cascader',
                placeholder: '级联选择',
                resetToInitialValue: true,
                valueKey: 'value',
                emitPath: true,
                depend: true,
                dependFields: ['bc', ...['level1', 'level2', 'level3']],
                disabled: (query) => !query.ac?.length,
                // hide: (query) => !query.ac?.length,
                getOptions(cb) {
                    setTimeout(() => {
                        cb([
                            { label: 'A', value: '1', children: [{ label: 'A-11111', value: '1-1' }] },
                            {
                                label: 'B',
                                value: '2',
                                children: [
                                    { label: 'B-11111', value: '2-1' },
                                    { label: 'B-22222', value: '2-2' },
                                ],
                            },
                            {
                                label: 'C',
                                value: '3',
                                children: [
                                    { label: 'C-11111', value: '3-1' },
                                    { label: 'C-22222', value: '3-2' },
                                    { label: 'C-33333', value: '3-3' },
                                    { label: 'C-44444', value: '3-4' },
                                ],
                            },
                        ]);
                    }, 2000);
                },
            },
        }),
        query: { test: '额外值', ac: '3-1', level1: 'bc_2', level2: 'bc_2-2', cc: ['1', '1-1'] },
        setQuery(item: any) {
            set(item.query, 'ac', '2-2');
            set(item.query, 'level1', 'bc_3');
            set(item.query, 'level2', 'bc_3-1');
            set(item.query, 'cc', ['1', '1-1']);
        },
    },
];

const { set } = window.Vue;
const { defineCondition } = window.HCondition;

export const conditionFactory = () => ({
    description: '',
    wrapperOption: {
        toast: (val: string) => alert(val),
        resetToInitialValue: true,
        resetTriggerSearch: true,
        size: 'small',
        // tag: 'main',
        class: 'h-condition',
        key: '',
        rules: {
            ra2: { required: true, message: '哈哈哈' },
        },
    },
    condition: defineCondition({
        ageBegin: {
            t: 'input',
            label: '年龄段搜索',
            placeholder: '青少年',
            clearable: true,
            defaultValue: '10',
            postfix: '-',
            rules: [{ required: true }],
        },
        ageMiddle: {
            t: 'input',
            placeholder: '中年',
            clearable: true,
            defaultValue: '40',
            postfix: '-',
            validator: (query) =>
                !isNaN(query.ageBegin) && Number(query.ageBegin) >= Number(query.ageMiddle) && '值不能小于青少年的值',
        },
        ageEnd: {
            t: 'input',
            placeholder: '老年',
            defaultValue: '80',
            clearable: true,
            validator: (query) =>
                !isNaN(query.ageMiddle) && Number(query.ageMiddle) >= Number(query.ageEnd) && '值不能小于中年的值',
        },
        ra1: {
            t: 'radio',
            label: '单选(可取消)',
            type: 'button',
            valueKey: 'dictValue',
            labelKey: 'dictLabel',
            cancelable: true,
            options: [
                { dictValue: '1', dictLabel: '单选1' },
                { dictValue: '2', dictLabel: '单选2' },
            ],
            defaultValue: '1',
        },
        ra2: {
            t: 'radio',
            label: '单选',
            type: 'button',
            valueKey: 'dictValue',
            labelKey: 'dictLabel',
            options: [
                { dictValue: '3', dictLabel: '单选1' },
                { dictValue: '4', dictLabel: '单选2' },
            ],
            // defaultValue: '3',
        },
        check: {
            t: 'checkbox',
            label: '多选',
            type: 'button',
            valueKey: 'dictValue',
            labelKey: 'dictLabel',
            options: [
                { dictValue: '1', dictLabel: '多选1' },
                { dictValue: '2', dictLabel: '多选2' },
            ],
            // defaultValue: () => ['1'],
        },
        sel1: {
            t: 'select',
            label: '依赖单选',
            placeholder: '请先选择单选',
            disabled: ({ query }) => !query.ra1,
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
        sel2: {
            t: 'select',
            label: '分组下拉框',
            placeholder: '请选择...',
            valueKey: 'dictValue',
            labelKey: 'dictLabel',
            options: [
                {
                    dictValue: 'group-1',
                    dictLabel: '分组选项A',
                    group: true,
                    children: [
                        { dictValue: 'group-1-1', dictLabel: 'v3-分组一' },
                        { dictValue: 'group-1-2', dictLabel: 'v3-分组二' },
                    ],
                },
                {
                    dictValue: '222',
                    dictLabel: '分组选项B',
                    group: true,
                    children: [
                        { dictValue: 'group-2-1', dictLabel: 'v3-group-分组一' },
                        { dictValue: 'group-2-2', dictLabel: 'v3-group-分组二' },
                    ],
                },
                { dictValue: '2', dictLabel: '选项二' },
                { dictValue: 'example', dictLabel: '选项三' },
            ],
            defaultValue: () => 'example',
        },
        cas1: {
            t: 'cascader',
            label: '级联(可选任意一级)',
            placeholder: '请选择...',
            resetToInitialValue: true,
            valueKey: 'value',
            fields: ['cascader-a', 'cascader-b'],
            // emitPath: true,
            props: { checkStrictly: true },
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
        cas2: {
            t: 'cascader',
            label: '级联(最后一级)',
            placeholder: '级联选择',
            fields: ['level1', 'level2', 'level3'],
            resetToInitialValue: true,
            valueKey: 'value',
            // emitPath: true,
            // disabled: ({ query }) => !query.ac?.length,
            // hide: ({query}) => !query.ac?.length,
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
        date: {
            t: 'datepicker',
            placeholder: '没有 label',
            // defaultValue: '2023-10-10',
        },
        date2: {
            t: 'datepicker',
            type: 'daterange',
            label: '日期区间',
            placeholder: '日期区间选择',
            startPlaceholder: '开始',
            endPlaceholder: '结束',
            beginField: 'startTime',
            endField: 'endTime',
            defaultValue: ['2023-10-08', '2023-10-11'],
        },
    }),
    query: { e: '1-1', 'cascader-a': '3', 'cascader-b': '3-3' } as Record<string, any>,
    setQuery(item: any) {
        set(item.query, 'a', '手动设置');
        set(item.query, 'b', '1');
        set(item.query, 'dd', (item.query.dd || 0) + 1);
        set(item.query, 'ad', (item.query.ad || 0) + 1);
    },
});

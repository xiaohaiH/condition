<script lang="tsx">
const { defineComponent, nextTick, onMounted, ref, set, markRaw, version } = window.Vue;
const { HWrapper, defineCondition } = window.HCondition;

/**
 * @file
 */
export default defineComponent({
    name: '',
    template: `
        <div>
            <HWrapper
                style="display: flex; flex-wrap: wrap"
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
    `,
    components: { HWrapper },
    // props: {},
    setup(props, context) {
        const formRef = ref<InstanceType<typeof HWrapper>>();
        const query = ref<Record<string, any>>({
            // input1: '1',
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
            // upload: {
            //     t: 'upload',
            //     label: '上传',
            //     style: { width: '160px' },
            //     placeholder: '上传',
            //     slotDefault: () => <div>sss</div>,
            //     slotTrigger: () => <div>点我</div>,
            //     autoUpload: false,
            //     getUploadInstance(upload) {
            //         console.log(upload);
            //     },
            // },
            selectV2: {
                t: 'select-v2',
                label: '虚下拉框',
                style: { width: '240px' },
                placeholder: '虚拟列表下拉框',
                options: [
                    { label: '第一', value: '1' },
                    { label: '第二', value: '2' },
                    { label: '第三', value: '3' },
                ],
            },
            color: {
                t: 'color-picker',
                label: '颜色',
                showAlpha: true,
                colorFormat: 'hsl',
            },
            num: {
                t: 'input-number',
                label: 'input-num',
                placeholder: 'gs',
                // stepStrictly: true,
                controlsPosition: 'right',
                // decreaseIcon: <div>123</div>,
                // increaseIcon: <div>456</div>,
            },
            rate: {
                t: 'rate',
                label: 'rate',
                colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
                allowHalf: true,
                showScore: true,
                scoreTemplate: '{value} 分',
            },
            slider: {
                t: 'slider',
                style: { width: '400px' },
                label: 'slider',
                showInput: true,
                // range: true,
            },
            switch: {
                t: 'switch',
                label: '切换器',
                activeValue: '1',
                inactiveValue: '0',
            },
            time: {
                t: 'time-picker',
                label: '时间',
                placeholder: '快选择时间',
            },
            timeSelect: {
                t: 'time-select',
                label: '时2',
                placeholder: '时间二',
                style: { width: '160px' },
            },
            input1: {
                t: 'input',
                label: 'input1',
                placeholder: '哈哈哈',
                // slotAppend: ({ query, insideSearch }) => {
                //     return (
                //         <div style="cursor: pointer;" onClick={() => ((query.input1 = '234'), insideSearch())}>
                //             点我
                //         </div>
                //     );
                // },
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
                // format: 'MM-DD',
                // valueFormat: 'YYYY-MM-DD',
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
        const keys = Object.keys(formCondition);
        let idx = 0;

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
            log: console.log,
            formRef,
            query,
            formCondition,
            rules,
            validate,
            validateField,
            clearValidate,
        };
    },
});
</script>

<style scoped></style>

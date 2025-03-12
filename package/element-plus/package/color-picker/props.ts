import { plainProps } from '@xiaohaih/condition-core';
import { ElColorPicker } from 'element-plus';
import { PropType } from 'vue';
import { commonProps, formItemProps } from '../share';

// @ts-expect-error UI.props报错
const { label, ...colorProps } = ElColorPicker.props as {};

export const colorPickerProps = {
    ...colorProps,
    // ...emits2Props(ElColorPicker.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
} as const;

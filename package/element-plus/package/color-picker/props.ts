import { PropType } from 'vue';
import { ElColorPicker } from 'element-plus';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const colorPickerProps = {
    ...(ElColorPicker.props as {}),
    // ...emits2Props(ElColorPicker.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
} as const;

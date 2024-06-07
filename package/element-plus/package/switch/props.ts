import { PropType } from 'vue';
import { ElSwitch } from 'element-plus';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

// @ts-expect-error UI.props报错
const { label, ...swiProps } = ElSwitch.props as {};

export const switchProps = {
    ...swiProps,
    // ...emits2Props(ElSwitch.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
} as const;

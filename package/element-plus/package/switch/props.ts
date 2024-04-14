import { PropType } from 'vue';
import { ElSwitch } from 'element-plus';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const switchProps = {
    ...(ElSwitch.props as {}),
    // ...emits2Props(ElSwitch.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
} as const;

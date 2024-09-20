import { PropType, VNode } from 'vue';
import { ElTimeSelect, timeSelectProps as timeProps } from 'element-plus';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const timeSelectProps = {
    ...(ElTimeSelect.props as typeof timeProps),
    // ...emits2Props(ElTimeSelect.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
} as const;

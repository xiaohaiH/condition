import { plainProps } from '@xiaohaih/condition-core';
import type { timeSelectProps as timeProps } from 'element-plus';
import { ElTimeSelect } from 'element-plus';
import { PropType, VNode } from 'vue';
import { commonProps, formItemProps } from '../share';

export const timeSelectProps = {
    ...(ElTimeSelect.props as typeof timeProps),
    // ...emits2Props(ElTimeSelect.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
} as const;

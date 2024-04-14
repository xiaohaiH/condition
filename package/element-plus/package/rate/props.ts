import { PropType } from 'vue';
import { ElRate } from 'element-plus';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const rateProps = {
    ...(ElRate.props as {}),
    // ...emits2Props(ElRate.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
} as const;

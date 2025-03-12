import { plainProps } from '@xiaohaih/condition-core';
import { Rate as ElRate } from 'element-ui';
import { PropType } from 'vue';
import { commonProps, formItemProps } from '../share';

export const rateProps = {
    // @ts-expect-error UI.props报错
    ...(ElRate.props as {}),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
} as const;

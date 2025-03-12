import { plainProps } from '@xiaohaih/condition-core';
import { ElRate } from 'element-plus';
import { PropType } from 'vue';
import { commonProps, formItemProps } from '../share';

// @ts-expect-error UI.props报错
const { label, ...ratProps } = ElRate.props as {};

export const rateProps = {
    ...ratProps,
    // ...emits2Props(ElRate.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
} as const;

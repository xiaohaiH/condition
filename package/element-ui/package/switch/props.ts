import { PropType } from 'vue';
import { Switch as ElSwitch } from 'element-ui';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const switchProps = {
    // @ts-expect-error UI.props报错
    ...(ElSwitch.props as {}),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
} as const;

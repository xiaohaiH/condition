import { plainProps } from '@xiaohaih/condition-core';
import { Slider as ElSlider } from 'element-ui';
import type { PropType } from 'vue';
import { commonProps, formItemProps } from '../share';

export const sliderProps = {
    range: { type: Boolean as PropType<boolean> },
    // @ts-expect-error UI.props报错
    ...(ElSlider.props as {}),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
} as const;

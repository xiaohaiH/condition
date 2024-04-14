import { PropType } from 'vue';
import { Slider as ElSlider } from 'element-ui';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const sliderProps = {
    range: { type: Boolean as PropType<boolean> },
    // @ts-expect-error UI.props报错
    ...(ElSlider.props as {}),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
} as const;

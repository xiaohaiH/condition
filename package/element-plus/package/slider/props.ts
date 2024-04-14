import { PropType } from 'vue';
import { ElSlider } from 'element-plus';
import { plainProps } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';

export const sliderProps = {
    range: { type: Boolean as PropType<boolean> },
    ...(ElSlider.props as {}),
    // ...emits2Props(ElSlider.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
} as const;

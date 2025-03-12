import { plainProps } from '@xiaohaih/condition-core';
import { ElSlider } from 'element-plus';
import type { PropType } from 'vue';
import { commonProps, formItemProps } from '../share';

// @ts-expect-error UI.props报错
const { label, ...sliProps } = ElSlider.props as {};

export const sliderProps = {
    range: { type: Boolean as PropType<boolean> },
    ...sliProps,
    // ...emits2Props(ElSlider.emits),
    ...plainProps,
    ...commonProps,
    ...formItemProps,
} as const;

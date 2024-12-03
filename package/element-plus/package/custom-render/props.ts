import type { PropType, VNode } from 'vue';
import { plainProps, usePlain } from '@xiaohaih/condition-core';
import { commonProps, formItemProps } from '../share';
import 'vue/jsx';

export const customRenderProps = {
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    render: {
        type: Function as PropType<(plain: ReturnType<typeof usePlain>) => () => VNode | VNode[] | JSX.Element | null>,
        required: true,
    },
} as const;

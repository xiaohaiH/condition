import type { usePlain } from '@xiaohaih/condition-core';
import { plainProps } from '@xiaohaih/condition-core';
import type { PropType, VNode } from 'vue';
import { commonProps, formItemProps } from '../share';

type B = typeof plainProps & typeof commonProps & typeof formItemProps;
export const customRenderProps = {
    ...plainProps,
    ...commonProps,
    ...formItemProps,
    render: {
        type: Function as PropType<(plain: ReturnType<typeof usePlain> & { props: B }) => () => VNode | VNode[] | JSX.Element | null>,
        required: true,
    },
} as const;

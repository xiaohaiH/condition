import type { SetupContext, VNode, VNodeNormalizedChildren, VNodeChild, FunctionalComponent } from 'vue';

type SortComponentProps = {
    /** 禁用排序 */
    disabled?: boolean;
};

/** VNode 排序组件 */
function SortComponent(props: SortComponentProps, context: Omit<SetupContext<{}>, 'expose'>) {
    if (props.disabled) return context.slots.default?.();
    const vNodes: (VNodeNormalizedChildren | VNodeChild)[] = [];
    context.slots.default?.().forEach((o) => {
        if (!o.children) return;
        Array.isArray(o.children)
            ? o.children.forEach((v) => {
                  vNodes.push(v);
              })
            : vNodes.push(o.children);
    });
    return vNodes.sort((a, b) => getSortValue(a) - getSortValue(b));
}

/** 获取排序的值 */
function getSortValue(vnode: any) {
    if (!vnode?.props) return 0;
    return (
        (vnode.props.hasOwnProperty('conditionSortIndex')
            ? Number(vnode.props.conditionSortIndex)
            : Number(vnode.props['condition-sort-index'])) || 0
    );
}

SortComponent.props = {
    /** 是否禁用排序组件 */
    disabled: { type: Boolean },
};

export { SortComponent };

import { ref, watch, onBeforeUnmount, ExtractPropTypes } from 'vue-demi';
import { CommonMethod } from './../common/provide';
import { commonProps } from './../common/props';
/**
 *
 */
export function useDisplay<T extends ExtractPropTypes<Readonly<typeof commonProps>>>(props: T, option: CommonMethod) {
    const insetDisabled = ref(typeof props.disabled === 'boolean' ? props.disabled : false);
    const insetHide = ref(typeof props.hide === 'boolean' ? props.hide : false);
    onBeforeUnmount(
        watch(
            () => props.query,
            () => {
                const a = typeof props.hide === 'function';
                if (typeof props.hide === 'function') {
                    insetHide.value = props.hide(props.query);
                    insetHide.value && option.reset().updateWrapperQuery();
                } else if (typeof props.disabled === 'function') {
                    insetDisabled.value = props.disabled(props.query);
                }
            },
            { immediate: true, deep: true },
        ),
    );
    return { insetDisabled, insetHide };
}

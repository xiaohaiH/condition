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
                if (typeof props.hide === 'function') {
                    const currentValue = insetHide.value;
                    const newValue = props.hide(props.query);
                    if (currentValue !== newValue) {
                        insetHide.value = props.hide(props.query);
                        insetHide.value && option.reset().updateWrapperQuery();
                    }
                } else if (typeof props.disabled === 'function') {
                    const currentValue = insetDisabled.value;
                    const newValue = props.disabled(props.query);
                    if (currentValue !== newValue) {
                        insetDisabled.value = props.disabled(props.query);
                    }
                }
            },
            { immediate: true, deep: true },
        ),
    );
    return { insetDisabled, insetHide };
}

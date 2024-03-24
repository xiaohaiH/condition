import { ref, watch, onBeforeUnmount, ExtractPropTypes, nextTick, computed } from 'vue-demi';
import { CommonMethod } from './constant';
import { commonProps } from './share';

/** 获取条件的初始值 */
export function useInitialValue<T extends ExtractPropTypes<Readonly<typeof commonProps>>>(props: T) {
    const setValue = ref<any>();
    const a = computed({
        set(value: any) {
            setValue.value = value;
        },
        get() {
            return setValue.value === undefined
                ? props.defaultValue !== undefined
                    ? typeof props.defaultValue === 'function'
                        ? props.defaultValue(props.query, props.backfill)
                        : props.defaultValue
                    : undefined
                : setValue.value;
        },
    });
    return a;
}

/**
 * 获取当前组件的显示和隐藏状态
 */
export function useDisplay<T extends ExtractPropTypes<Readonly<typeof commonProps>>>(props: T, option: CommonMethod) {
    const insetDisabled = ref(typeof props.disabled === 'boolean' ? props.disabled : false);
    const insetHide = ref(typeof props.hide === 'boolean' ? props.hide : false);
    const getOption = () => ({ query: props.query, backfill: props.backfill, option });
    const cb = () => {
        if (typeof props.hide === 'function') {
            const currentValue = insetHide.value;
            const newValue = props.hide(getOption());
            if (currentValue !== newValue) {
                insetHide.value = props.hide(getOption());
            }
        } else if (typeof props.disabled === 'function') {
            const currentValue = insetDisabled.value;
            const newValue = props.disabled(getOption());
            if (currentValue !== newValue) {
                insetDisabled.value = props.disabled(getOption());
            }
        }
    };
    let isChanged = false;
    let listeners = [
        watch(() => props.query, cb, { immediate: true, deep: true }),
        watch(
            () => [props.disabled, props.hide],
            (val, val2) => {
                if (val[0] !== val2[0]) {
                    insetDisabled.value = typeof val[0] === 'boolean' ? val[0] : false;
                    typeof val[0] === 'function' && (isChanged = true);
                }
                if (val[1] !== val2[1]) {
                    insetHide.value = typeof val[1] === 'boolean' ? val[1] : false;
                    typeof val[1] === 'function' && (isChanged = true);
                }
                cb();
                isChanged = false;
            },
        ),
    ];
    onBeforeUnmount(() => (listeners.forEach((o) => o()), (listeners = [])));
    return { insetDisabled, insetHide };
}

/**
 * 转换当前事件循环内更新标识
 * @param {boolean} initialValue 初始状态
 */
export function useDisableInCurrentCycle(initialValue = true) {
    /** 是否允许改变 */
    const flag = ref(initialValue);
    /** 禁止改变 */
    const updateFlag = () => {
        flag.value = !initialValue;
        nextTick(() => {
            flag.value = initialValue;
        });
    };
    return { flag, updateFlag };
}

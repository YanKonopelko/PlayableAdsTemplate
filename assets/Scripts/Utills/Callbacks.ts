export type CallbackType<T> = (x: T) => T;
export type VoidWithParamCallbackType<T> = (x: T) => void;
export type VoidWithTwoParamCallbackType<T1, T2> = (p1: T1, p2:T2) => void;
export type VoidCallbackType = () => void;
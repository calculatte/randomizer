export interface Setting<T> {
    title: string;
    description: string;
    disabled?: boolean | (() => boolean);
    set: (value: T) => void;
    get: () => T;
}
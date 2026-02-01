export interface Setting<T> {
    title: string;
    description: string;
    disabled?: boolean;
    set: (value: T) => void;
    get: () => T;
}
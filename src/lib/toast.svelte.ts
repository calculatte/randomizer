export type ToastType = | "error" | "info" | "info-square" | "success" | "warning" | "warning-alt";

export interface ToastData {
    kind?: ToastType
    title?: string;
    subtitle?: string;
    caption?: string;
    timeout?: number;
}

export type ToastEventTypes = {
    "show": ToastData;
};

const EVENT_BUS: EventTarget = new EventTarget();

function emit<K extends keyof ToastEventTypes>(
    eventName: K,
    detail: ToastEventTypes[K]
): void {
    EVENT_BUS.dispatchEvent(new CustomEvent(eventName, { detail }));
}

function subscribe<K extends keyof ToastEventTypes>(
    eventName: K,
    handler: (event: CustomEvent<ToastEventTypes[K]>) => void
): () => void {
    EVENT_BUS.addEventListener(eventName, handler as EventListener);

    return () => {
        EVENT_BUS.removeEventListener(eventName, handler as EventListener);
    }
}

export const toast = { emit, subscribe };

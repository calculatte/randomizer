import { writable, type Writable } from "svelte/store";

export const isResetOpen: Writable<boolean> = writable(false);
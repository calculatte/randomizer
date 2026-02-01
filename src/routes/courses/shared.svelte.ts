import { type Writable, writable } from "svelte/store";
import { Manager } from "./types/Manager";

export const manager: Writable<Manager> = writable<Manager>(new Manager());
export const isCourseModalOpen: Writable<boolean> = writable(false);
export const isPartitionModalOpen: Writable<boolean> = writable(false);

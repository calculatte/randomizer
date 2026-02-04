import { writable, type Writable } from "svelte/store";
import type { Course } from "$lib/types/Course.svelte";
import type { Partition } from "$lib/types/Partition.svelte";

export interface SelectionState {
    courses: Course[];
    partitions: Partition[];
}

export const selection: SelectionState = $state({
    courses: [],
    partitions: []
});

export const numberOfProblems: Writable<number | null> = writable(null);
import type { Course } from "$lib/types/Course.svelte";
import { Partition } from "$lib/types/Partition.svelte";

export class Manager {
    course: Course|null;
    partition: Partition|null;
    tableSize: number;
    startAt: number;
    endAt: number;
    rows: { courses: Course[], partitions: Partition[] };
    refresh: boolean;

    constructor() {
        this.refresh = false;
        this.course = null;
        this.partition = null;
        this.tableSize = 8;
        this.startAt = Partition.START_AT;
        this.endAt = Partition.END_AT;
        this.rows = {
            courses: [],
            partitions: []
        };
    }

    public sync(): void {
        this.refresh = true;
        this.rows.courses = [];
        this.rows.partitions = [];
    }

    public isInvalidStartAt(): boolean {
        return this.startAt < 1 || this.startAt >= this.endAt;
    }

    public isInvalidEndAt(): boolean {
        return this.endAt < 1 || this.endAt <= this.startAt;
    }

    public resetStartEndRange(): void {
        this.startAt = Partition.START_AT;
        this.endAt = Partition.END_AT;
    }
}
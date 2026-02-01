import { Course } from "$lib/types/Course.svelte";

interface Runtime {
    selected: boolean;
    range: number[];
    numberOfProblems: number;
}

export class Partition {
    id: string;
    name: string;
    description: string;
    private startAt: number;
    private endAt: number;
    parent: Course;
    runtime: Runtime;

    constructor(parent: Course, name: string, description: string) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.description = description;
        this.parent = parent;
        this.startAt = Partition.START_AT;
        this.endAt = Partition.END_AT;
        this.runtime = $state({
            selected: false,
            range: [this.startAt, this.endAt],
            numberOfProblems: 1
        });

        Object.defineProperty(this, "parent", {
            enumerable: false
        });
    }

    setStartAt(at: number) {
        this.runtime.range[0] = at;
        this.startAt = at;
    }

    setEndAt(at: number) {
        this.runtime.range[1] = at;
        this.endAt = at;
    }

    getStartAt() {
        return this.startAt;
    }

    getEndAt() {
        return this.endAt;
    }

    public getNumberOfProblems(): number {
        return this.endAt - this.startAt + 1
    }

    public static START_AT: number = 1;
    public static END_AT: number = 100;

    public static empty(): Partition {
        return new Partition(Course.empty(), "", "");
    }
}
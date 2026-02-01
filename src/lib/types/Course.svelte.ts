import { Partition } from "$lib/types/Partition.svelte";

interface Runtime {
    selected: boolean;
    numberOfProblems: number;
}

export class Course {
    id: string;
    name: string;
    description: string;
    partitions: Partition[];
    runtime: Runtime;

    constructor(name: string, description: string) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.description = description;
        this.partitions = [];
        this.runtime = $state({
            selected: false,
            numberOfProblems: 1
        });

        // Object.defineProperty(this, "runtime", {
        //     enumerable: false
        // });
    }

    public addPartition(name: string, description: string): Partition {
        const partition = new Partition(this, name, description == null ? "" : description);
        this.partitions.push(partition);

        return partition;
    }

    public removePartition(id: string): void {
        this.partitions = this.partitions.filter((partition: Partition): boolean => partition.id !== id);
    }

    public findPartition(id: string): Partition | undefined {
        return this.partitions.find((partition: any): boolean => partition.id === id);
    }

    public getNumberOfPartitions(): number {
        return this.partitions.length;
    }

    public getNumberOfProblems(): number {
        return this.partitions
            .map(partition => partition.getNumberOfProblems())
            .reduce((a, b) => a + b, 0);
    }

    public static empty(): Course {
        return new Course("", "");
    }
}
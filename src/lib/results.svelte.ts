import type { Partition } from "./types/Partition.svelte";
import type { Course } from "./types/Course.svelte";
import type { TreeNode } from "carbon-components-svelte/src/TreeView/TreeView.svelte";
import { type Persisted, type Serializer, persisted } from "svelte-persisted-store";
import { toast } from "$lib/toast.svelte";

export interface PartitionNode extends TreeNode {
    problems: Set<number>;
}

export interface CourseNode extends TreeNode {
    nodes: PartitionNode[];
}

export function makeCourseNode(course: Course): CourseNode {
    return {
        id: course.id,
        text: course.name,
        nodes: []
    };
}

export function makePartitionNode(partition: Partition): PartitionNode {
    return {
        id: partition.id,
        text: partition.name,
        problems: new Set()
    };
}

const serializer: Serializer<CourseNode[]> = {
    parse(text: string): CourseNode[] {
        const parsed: any = JSON.parse(text);
        const results: CourseNode[] = [];

        if (Array.isArray(parsed)) {
            parsed.forEach((parent: any): void => {
                if (typeof parent.courseId == "string") {
                    let sections: PartitionNode[] = [];

                    if (Array.isArray(parent.nodes)) {
                        parent.nodes.forEach((child: any): void => {
                            const isNodeLike = typeof child.id == "string" && typeof child.text == "string";

                            if (isNodeLike && typeof child.partitionId == "string" && Array.isArray(child.nodes)) {
                                sections.push({
                                    id: (child.id as string),
                                    text: (child.text as string),
                                    problems: new Set(),
                                    nodes: child.nodes
                                });
                            }
                        });
                    }

                    if (sections.length === 0) {
                        sections.push({
                            id: crypto.randomUUID(),
                            text: "No partitions were selected.",
                            problems: new Set()
                        });
                    }

                    results.push({
                        id: (parent.id as string),
                        text: (parent.text as string),
                        nodes: sections
                    });
                }
            });
        }

        return results;
    },

    stringify(object: CourseNode[]): string {
        return JSON.stringify(object);
    }
}

export const results: Persisted<CourseNode[]> = persisted("results", [], {
    serializer,
    syncTabs: true,
    onWriteError: (error) => {
        console.error("Error when writing results persistence", error);

        if (error != null && typeof error == "object") {
            let message = (error as Error).message;

            if (message != null) {
                toast.emit("show", {
                    kind: "error",
                    title: "Error",
                    subtitle: message
                });
            }
        }
    },
    onParseError: (raw, error) => {
        console.error("Error when parsing results restore", error, raw);

        if (error != null && typeof error == "object") {
            let message = (error as Error).message;

            if (message != null) {
                toast.emit("show", {
                    kind: "error",
                    title: "Error",
                    subtitle: message
                });
            }
        }
    }
});
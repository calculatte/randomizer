import type { TreeNode } from "carbon-components-svelte/src/TreeView/TreeView.svelte";
import { type Persisted, type Serializer, persisted } from "svelte-persisted-store";
import { toast } from "$lib/toast.svelte";

export interface Section extends TreeNode {
    partitionId: string;
    problems: Set<number>;
}

export interface Randomized extends TreeNode {
    courseId: string;
    nodes: Section[];
}

const serializer: Serializer<Randomized[]> = {
    parse(text: string): Randomized[] {
        const parsed: any = JSON.parse(text);
        const results: Randomized[] = [];

        if (Array.isArray(parsed)) {
            parsed.forEach((parent: any): void => {
                if (typeof parent.courseId == "string") {
                    let sections: Section[] = [];

                    if (Array.isArray(parent.nodes)) {
                        parent.nodes.forEach((child: any): void => {
                            const isNodeLike = typeof child.id == "string" && typeof child.text == "string";

                            if (isNodeLike && typeof child.partitionId == "string" && Array.isArray(child.nodes)) {
                                sections.push({
                                    id: (child.id as string),
                                    text: (child.text as string),
                                    partitionId: (child.partitionId as string),
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
                            partitionId: "null",
                            problems: new Set()
                        });
                    }

                    results.push({
                        id: (parent.id as string),
                        text: (parent.text as string),
                        courseId: (parent.courseId as string),
                        nodes: sections
                    });
                }
            });
        }

        return results;
    },

    stringify(object: Randomized[]): string {
        return JSON.stringify(object);
    }
}

export const results: Persisted<Randomized[]> = persisted("results", [], {
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
import { writable, type Writable } from "svelte/store";
import { Partition } from "$lib/types/Partition.svelte";
import { ArrayUtil } from "./array";
import { Cache } from "./Cache";
import { makeCourseNode, makePartitionNode, type CourseNode, type PartitionNode } from "$lib/results.svelte";
import type { Course } from "$lib/types/Course.svelte";
import type { Config } from "$lib/types/Config";

interface SelectedCourse {
    course: Course,
    partitions: Partition[]
}

interface RandomizerCache {
    courses: Cache<string, CourseNode>,
    partitions: Cache<string, PartitionNode>
    selected: SelectedCourse[]
}

export interface RandomizeOptions {
    config: Config;
    selection: SelectionState;
    poolSize: number;
    pullFromAll: boolean;
    hideEmptyNodes: boolean;
}

export interface SelectionState {
    courses: Course[];
    partitions: Partition[];
}

export const globalPoolSize: Writable<number | null> = writable(null);
export const selection: SelectionState = $state({ courses: [], partitions: [] });

export const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeCache(options: RandomizeOptions): RandomizerCache {
    const selected: SelectedCourse[] = [];

    for (const course of options.selection.courses) {
        if (course.runtime.selected) {
            selected.push({ course, partitions: [] });

            for (const partition of course.partitions) {
                if (partition.runtime.selected) {
                    selected[selected.length - 1].partitions.push(partition);
                }
            }
        }
    }

    return { courses: new Cache(), partitions: new Cache(), selected };
}

function setPartitionNodeInCourseNode(pNode: PartitionNode, cNode: CourseNode): void {
    for (const node of cNode.nodes) {
        if (node.id === pNode.id) {
            return;
        }
    }

    cNode.nodes.push(pNode);
}

function generateNodeTree(options: RandomizeOptions, cache: RandomizerCache): CourseNode[] {
    const coursesToDestroy: CourseNode[] = [];
    const partitionsToDestroy: string[] = [];

    for (const pNode of cache.partitions.values()) {
        if (pNode.problems.size === 0) {
            if (options.hideEmptyNodes) {
                partitionsToDestroy.push(pNode.id.toString());
            } else {
                pNode.nodes = [];
                pNode.nodes.push({
                    id: crypto.randomUUID(),
                    text: "No problems were assigned."
                });
            }
        } else {
            pNode.nodes = [];
            pNode.nodes.push({
                id: crypto.randomUUID(),
                text: Array.from(pNode.problems).sort((a, b) => a - b).join(", ")
            });
        }
    }

    for (const pid of partitionsToDestroy) {
        for (const cNode of cache.courses.values()) {
            ArrayUtil.removeIf(cNode.nodes, (pNode => pNode.id === pid));
        }
    }

    for (const cNode of cache.courses.values()) {
        if (cNode.nodes.length === 0) {
            if (options.hideEmptyNodes) {
                coursesToDestroy.push(cNode);
            } else {
                cNode.text = "No partitions were selected.";
            }
        }
    }

    for (const cNode of coursesToDestroy) {
        cache.courses.delete(cNode.id.toString());
    }

    return cache.courses.values();
}

function prepareNodeTree(cache: RandomizerCache): void {
    for (const selected of cache.selected) {
        const cNode = cache.courses.set(selected.course.id, makeCourseNode(selected.course));

        for (const partition of selected.partitions) {
            const pNode = cache.partitions.set(partition.id, makePartitionNode(partition));

            setPartitionNodeInCourseNode(pNode, cNode);
        }
    }
}

function generateRandomProblemFromSelected(selected: SelectedCourse, problems: Set<number>, cache: RandomizerCache): void {
    const partition: Partition | undefined = ArrayUtil.getRandom(selected.partitions);

    if (partition === undefined) {
        return;
    }

    const cNode: CourseNode = cache.courses.getOrElse(selected.course.id, makeCourseNode(selected.course));
    const pNode: PartitionNode = cache.partitions.getOrElse(partition.id, makePartitionNode(partition));
    const problem: number = getRandomNumber(partition.runtime.range[0], partition.runtime.range[1]);

    problems.add(problem);
    pNode.problems.add(problem);

    setPartitionNodeInCourseNode(pNode, cNode);
}

function randomGlobalPoolCollector(options: RandomizeOptions): CourseNode[] {
    const problems: Set<number> = new Set();
    const cache: RandomizerCache = makeCache(options);

    prepareNodeTree(cache);

    while (problems.size < options.poolSize) {
        const selected: SelectedCourse | undefined = ArrayUtil.getRandom(cache.selected);

        if (selected !== undefined) {
            generateRandomProblemFromSelected(selected, problems, cache);
        }
    }

    return generateNodeTree(options, cache);
}

function randomCoursePoolCollector(options: RandomizeOptions): CourseNode[] {
    const cache: RandomizerCache = makeCache(options);

    prepareNodeTree(cache);

    for (const selected of cache.selected) {
        let problems: Set<number> = new Set();

        while (problems.size < selected.course.runtime.numberOfProblems) {
            generateRandomProblemFromSelected(selected, problems, cache);
        }
    }

    return generateNodeTree(options, cache);
}

export const randomizer = (options: RandomizeOptions): CourseNode[] => {
    let output: CourseNode[] = [];

    if (options.pullFromAll) {
        output = randomGlobalPoolCollector(options);
    } else {
        output = randomCoursePoolCollector(options);
    }

    return output;
}
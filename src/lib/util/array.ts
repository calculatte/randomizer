import { getRandomNumber } from "./randomize.svelte";

function getRandom<T>(array: T[]): T | undefined {
    if (array.length === 0) {
        return undefined;
    } else if (array.length === 1) {
        return array[0];
    }

    let min = 0;
    let max = array.length - 1;

    return array[getRandomNumber(min, max)];
}

function remove<T>(array: T[], element: T): void {
    const index = array.indexOf(element);

    if (index > -1) {
        array.splice(index, 1);
    }
}

function removeIf<T>(array: T[], predicate: (element: T) => boolean): void {
    for (const el of array) {
        if (predicate(el)) {
            remove(array, el);
        }
    }
}

export const ArrayUtil = {
    getRandom,
    removeIf,
    remove
};
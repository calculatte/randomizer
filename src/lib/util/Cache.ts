export class Cache<K, V> {
    private cache: Map<K, V>;

    constructor() {
        this.cache = new Map();
    }

    public get(key: K): V | undefined {
        const value: V | undefined = this.cache.get(key);

        if (value === undefined) {
            return undefined;
        }

        return value;
    }

    public getOrElse(key: K, orElse: V): V {
        const value: V | undefined = this.cache.get(key);

        if (value === undefined) {
            return orElse;
        }

        return value;
    }

    public set(key: K, value: V): V {
        this.cache.set(key, value);

        return value;
    }

    public has(key: K): boolean {
        return this.cache.has(key);
    }

    public delete(key: K): boolean {
        return this.cache.delete(key);
    }

    public size(): number {
        return this.cache.size;
    }

    public clear(): void {
        this.cache.clear();
    }

    public values(): V[] {
        return [...this.cache.values()];
    }
}
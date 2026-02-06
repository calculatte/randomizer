export class Cache<K, V> {
    private cache: Map<K, V>;
    private limit: number;

    constructor(limit: number = 100) {
        this.limit = limit;
        this.cache = new Map();
    }

    private _mostRecent(key: K, value: V): V {
        this.cache.delete(key);
        this.cache.set(key, value);

        return value;
    }

    public get(key: K): V | undefined {
        const value: V | undefined = this.cache.get(key);

        if (value === undefined) {
            return undefined;
        }

        return  this._mostRecent(key, value);
    }

    public getOrElse(key: K, orElse: V): V {
        const value: V | undefined = this.cache.get(key);

        if (value === undefined) {
            return orElse;
        }

        return this._mostRecent(key, value);
    }

    public set(key: K, value: V): void {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }

        this.cache.set(key, value);

        if (this.cache.size > this.limit) {
            const oldest: IteratorResult<K, undefined> = this.cache.keys().next();

            if (oldest.value) {
                this.cache.delete(oldest.value);
            }
        }
    }

    public has(key: K): boolean {
        return this.cache.has(key);
    }

    public size(): number {
        return this.cache.size;
    }

    public clear(): void {
        this.cache.clear();
    }
}
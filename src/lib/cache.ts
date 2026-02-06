/**
 * LRU (Least Recently Used) Cache implementation
 * Automatically evicts least recently used items when max size is reached
 */
export class LRUCache<K, V> {
    private cache: Map<K, V>;
    private readonly maxSize: number;

    constructor(maxSize: number = 100) {
        this.cache = new Map();
        this.maxSize = maxSize;
    }

    get(key: K): V | undefined {
        const value = this.cache.get(key);
        if (value !== undefined) {
            // Move to end (most recently used)
            this.cache.delete(key);
            this.cache.set(key, value);
        }
        return value;
    }

    set(key: K, value: V): void {
        // Remove if exists to re-add at end
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }

        // Add to end (most recently used)
        this.cache.set(key, value);

        // Evict oldest if over max size
        if (this.cache.size > this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey !== undefined) {
                this.cache.delete(firstKey);
            }
        }
    }

    has(key: K): boolean {
        return this.cache.has(key);
    }

    delete(key: K): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    get size(): number {
        return this.cache.size;
    }
}

/**
 * TTL (Time To Live) Cache Entry
 */
export type TTLCacheEntry<T> = {
    data: T;
    timestamp: number;
};

/**
 * Cache with TTL support
 */
export class TTLCache<K, V> {
    private cache: LRUCache<K, TTLCacheEntry<V>>;
    private readonly ttl: number;

    constructor(maxSize: number = 100, ttlMs: number = 60000) {
        this.cache = new LRUCache(maxSize);
        this.ttl = ttlMs;
    }

    get(key: K): V | undefined {
        const entry = this.cache.get(key);
        if (!entry) return undefined;

        // Check if expired
        if (Date.now() - entry.timestamp > this.ttl) {
            this.cache.delete(key);
            return undefined;
        }

        return entry.data;
    }

    set(key: K, value: V): void {
        this.cache.set(key, {
            data: value,
            timestamp: Date.now()
        });
    }

    has(key: K): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;

        // Check if expired
        if (Date.now() - entry.timestamp > this.ttl) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    delete(key: K): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    get size(): number {
        return this.cache.size;
    }
}

/*!
 * Pseudo Hash Map
 * Copyright(c) 2018 Benjamin Martin
 * MIT Licensed
 */

class PseudoHashMap extends Map {
    constructor(serialise, iterable) {
        super();
        this.serialise = serialise;

        if (typeof iterable !== 'undefined') {
            for (let [key, value] of iterable) {
                this.set(key, value);
            }
        }
    }

    set(key, value) {
        super.set(this.serialise(key), [key, value])
    }

    get(key) {
        const [originalKey, value] = super.get(this.serialise(key))
        return value;
    }

    has(key) {
        return super.has(this.serialise(key))
    }

    delete(key) {
        return super.delete(this.serialise(key))
    }

    *entries() {
        for (let [key, [originalKey, value]] of super.entries()) {
            yield [originalKey, value]
        }
    }

    forEach(callback, thisArg) {
        super.forEach(([originalKey, value], key, map) => {
            callback(value, key, map)
        }, thisArg);
    }

    *keys() {
        for (let [originalKey, value] of super.values()) {
            yield originalKey
        }
    }

    [Symbol.iterator]() {
        return this.entries()
    }
}

module.exports = PseudoHashMap;
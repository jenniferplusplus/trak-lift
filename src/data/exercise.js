import {Exercise as ExerciseModel} from "../models.js";
import {Db, tokenize, textSearch} from "./db.js";

const Store = 'exercises';

class Exercise {
    constructor() {
        this.ready = this.init();
        this.ready.catch(console.error);
    }

    init() {
        return Db()
            .then(db => db.count(Store))
            .then(count => {
                if (count === 0) this.reload().catch(console.error);
            });
    }

    async reload() {
        const json = await fetch('/exercises.json').then(res => res.json());
        const db = await Db();
        const tx = db.transaction(Store, 'readwrite');
        const adds = json.data.map(async (row) => {
            return await tx.store.get(row.name) || this.upsert(row, tx);
        });

        await Promise.all([
            ...adds,
            tx.done,
        ]);
    }

    /**
     *
     * @param {string} name
     * @param {IDBTransaction?} tx
     * @returns {Promise<ExerciseModel>}
     */
    async get(name, tx = null) {
        tx ??= (await Db()).transaction(Store, 'readwrite');
        return await tx.store.get(name);
    }

    /**
     *
     * @param {string?} key - Key to begin iteration
     * @returns {Promise<[ExerciseModel]>}
     */
    async all(key = null) {
        const db = await Db();
        const cursor = await db.transaction(Store).store.openCursor(key);
        return collect(cursor);
    }

    /**
     * @arg {string} name
     * @arg {number} page=0
     * @returns {Ranked}
     */
    async search(name, page = 0) {
        const db = await Db();
        const tx = db.transaction(Store);
        const index = tx.objectStore(Store).index('tokens');

        return rank(textSearch(index, name));
    }

    /**
     *
     * @param {ExerciseModel} model
     * @param {IDBTransaction?} tx
     * @returns {Promise<*>}
     */
    async upsert(model, tx = null) {
        tx ??= (await Db()).transaction(Store, 'readwrite');
        model.tokens = tokenize(model.name);

        return await tx.store.put(model);
    }

    /**
     *
     * @param name
     * @param {IDBTransaction?} tx
     * @returns {Promise<*>}
     */
    async remove(name, tx = null) {
        tx ??= (await Db()).transaction(Store, 'readwrite');

        return await tx.store.delete(name);
    }
}

export class Ranked {
    _rank = -1;
    _pages = [];
    values = {};
    rankedValues = [];
    rankedKeys = {};

    constructor() {
    }

    pages() {
        return this.rankedValues?.length;
    }

    page(rank = null) {
        const r = rank ?? --this._rank;
        // if (rank === null && this._rank >= 0) this._rank--;
        return this.rankedValues[r];
    }

    add(value, key) {
        this.values[key] = value;
        let rank = this.rankedKeys[key] ?? 0;
        rank++;
        this.rankedKeys[key] = rank;
    }

    finalize() {
        Object.keys(this.rankedKeys).forEach((key) => {
            this.rankedValues[this.rankedKeys[key]] ??= [];
            this.rankedValues[this.rankedKeys[key]].push(this.values[key]);
        });
        this.rankedValues = this.rankedValues.filter(n => n);
        this._rank = this.rankedValues.length;
    }
}

async function rank(iterable) {
    const ranked = new Ranked();
    for await (const each of iterable) {
        ranked.add(each, each.name);
    }
    ranked.finalize();
    return ranked;
}

async function collect(cursor) {
    const collection = [];
    for await (const each of cursor) {
        collection.push(each.value);
    }
    return collection;
}

const singleton = new Exercise();
export default singleton;
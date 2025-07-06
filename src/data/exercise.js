import {Db, textSearch, tokenize} from "./db.js";
import {Ranked, Paged} from "./types.js";
import {base} from "../../vite.config.js";

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
                if (count === 0) return this.reload().catch(console.error);
            });
    }

    async reload() {
        // try {
            const res = await fetch(`/exercises.json`);//.then(res => res.json());
            console.log('reload', 'fetch', res);
            const json = await res.json();
            console.log('reload', 'json', json);
            const db = await Db();
            const tx = db.transaction(Store, 'readwrite');
            const adds = json.data.map(async (row) => {
                return await tx.store.get(row.name) || this.upsert(row, tx);
            });
        // } catch (e) {
        //     console.log(e)
        // }

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
     * @returns {Promise<Paged>}
     */
    async all(key = null) {
        const db = await Db();
        const cursor = await db.transaction(Store).store.openCursor();
        return Paged.fromCursor(cursor, 20);
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

        return Ranked.from(textSearch(index, name));
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

const singleton = new Exercise();
export default singleton;

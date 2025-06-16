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
        const json = await fetch('/public/exercises.json').then(res => res.json());
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
    async get(name, tx=null) {
        tx ??= (await Db()).transaction(Store, 'readwrite');
        return await tx.store.get(name);
    }

    /**
     *
     * @param {string?} key - Key to begin iteration
     * @returns {Promise<*>}
     */
    async all(key=null){
        const db = await Db();
        return await db.transaction(Store).store.openCursor(key);
    }

    /**
     * @arg {string} name
     * @arg {number} page=0
     * @returns {Promise<AsyncGenerator<ExerciseModel>>}
     */
    async search(name, page=0) {
        const db = await Db();
        const tx = db.transaction(Store);
        const index = tx.objectStore(Store).index('tokens');

        return textSearch(index, name);
    }

    /**
     *
     * @param {ExerciseModel} model
     * @param {IDBTransaction?} tx
     * @returns {Promise<*>}
     */
    async upsert(model, tx=null) {
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
    async remove(name, tx=null) {
        tx ??= (await Db()).transaction(Store, 'readwrite');

        return await tx.store.delete(name);
    }
}

const singleton = new Exercise();
export default singleton;
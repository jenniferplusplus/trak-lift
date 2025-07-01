import {Routine as RoutineModel} from "../models.js";
import {Db, tokenize, textSearch} from "./db.js";
import {Paged, Ranked} from "./types.js";

const Store = 'routines';

class Routine {
    constructor() {
    }

    /**
     *
     * @param {string} name
     * @param {IDBTransaction?} tx
     * @returns {Promise<RoutineModel>}
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
     * @param {RoutineModel} model
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

const singleton = new Routine();
export default singleton;
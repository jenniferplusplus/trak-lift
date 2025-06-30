import {Db, tokenize, keySearch, dateSearch} from "./db.js";
import {Paged, Ranked} from "./types.js";

const Store = 'sessions';

class Routine {
    constructor() {
    }

    /**
     *
     * @param {Number} id
     * @param {IDBTransaction?} tx
     * @returns {Promise<RoutineModel>}
     */
    async get(id, tx = null) {
        tx ??= (await Db()).transaction(Store, 'readwrite');
        return await tx.store.get(id);
    }

    /**
     *
     * @param {string?} key - Key to begin iteration
     * @returns {Promise<Paged>}
     */
    async all(key = null) {
        const db = await Db();
        const cursor = await db.transaction(Store).store.openCursor();
        return Paged.from(cursor, 20);
    }

    /**
     * @arg {string} name
     * @arg {number} page=0
     * @returns {Promise<Paged>}
     */
    async searchByRoutine(name, page = 0) {
        const db = await Db();
        const tx = db.transaction(Store);
        const cursor = tx.objectStore(Store).index('routine');

        return Paged.from(keySearch(cursor, name), 20);
    }

    /**
     * @returns {Promise<Paged>}
     * @param {Date} date
     * @param {Date} dateEnd
     */
    async searchByDate(date, dateEnd) {
        const db = await Db();
        const tx = db.transaction(Store);
        const cursor = tx.objectStore(Store).index('start');

        return Paged.from(dateSearch(cursor, date, dateEnd), 20);
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
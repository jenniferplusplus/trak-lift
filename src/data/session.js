import {Db, tokenize, keySearch, dateSearch} from "./db.js";
import {Paged, Ranked} from "./types.js";
import {Session as SessionModel} from "../models.js";

const Store = 'sessions';

class Session {
    constructor() {
    }

    /**
     *
     * @param {Number} id
     * @param {IDBTransaction?} tx
     * @returns {Promise<SessionModel>}
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
        return Paged.fromCursor(cursor, 20);
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

        return Paged.fromEnumerable(keySearch(cursor, name), 20);
    }

    /**
     * @returns {Promise<Paged>}
     * @param {Number} date
     * @param {Number} dateEnd
     */
    async searchByDate(date, dateEnd) {
        const db = await Db();
        const tx = db.transaction(Store);
        const cursor = tx.objectStore(Store).index('start');

        return Paged.fromEnumerable(dateSearch(cursor, date, dateEnd), 20);
    }

    /**
     *
     * @param {SessionModel} model
     * @param {IDBTransaction?} tx
     * @returns {Promise<*>}
     */
    async upsert(model, tx = null) {
        tx ??= (await Db()).transaction(Store, 'readwrite');

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

const singleton = new Session();
export default singleton;
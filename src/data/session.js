import {Session as SessionModel} from '../models.js';
import {dateSearch, Db, keySearch} from "./db.js";
import {Paged} from "./types.js";

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
        const cursor = await db.transaction(Store).store.openCursor(null, 'prev');
        return Paged.fromCursor(cursor, 20);
    }

    /**
     * @param limit {Number}
     * @param tx {IDBTransaction}
     * @returns {Promise<[SessionModel]>}
     */
    async last(limit = null, tx = null) {
        tx ??= (await Db()).transaction(Store);
        let cursor = await tx.store.openCursor(null, 'prev');
        let i = 0;
        const result = [];
        while (cursor && i < limit) {
            result.push(cursor.value);
            i++;
            cursor = await cursor.continue();
        }
        return result;
    }

    /**
     * @param limit {Number}
     * @param tx {IDBTransaction}
     * @returns {Promise<Paged>}
     */
    async active(limit = null) {
        const db = await Db();
        const tx = db.transaction(Store);
        let cursor = await tx.objectStore(Store).index('stop')
            .openCursor(IDBKeyRange.upperBound(Number.MAX_SAFE_INTEGER - 1), 'prev');
        let i = 0;
        const result = [];
        while (cursor && i < limit) {
            result.push(cursor.value);
            i++;
            cursor = await cursor.continue();
        }
        return result;
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

        if (model.id === undefined) {
            const last = (await this.last(1, tx))[0];
            model.id = last === undefined ? 0 : last.id + 1;
        }
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
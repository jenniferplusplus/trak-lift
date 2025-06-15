import {openDB} from 'idb';

/**
 * @returns {Promise<IDBDatabase>}
 * @constructor
 */
export async function Db() {
    return openDB("App", 1, {upgrade, blocked, blocking, terminated});
}

function upgrade (db, oldVersion, newVersion, transaction, event) {
    const exercises = db.createObjectStore('exercises', {keyPath: 'name'});
    exercises.createIndex('kind', 'kind');
}

function blocked(currentVersion, blockedVersion, event) {
    // …
}

function blocking(currentVersion, blockedVersion, event) {
    // …
}

function terminated() {
    // …
}
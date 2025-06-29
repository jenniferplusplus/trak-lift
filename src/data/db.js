import {openDB} from 'idb';
import { length, substr } from 'stringz';

/**
 * @returns {Promise<IDBDatabase>}
 * @constructor
 */
export async function Db() {
    return openDB("App", 1, {upgrade, blocked, blocking, terminated});
}

/**
 *
 * @param {string} name
 * @returns {[string]}
 */
export function tokenize(name) {
    const substrings = name.split(/\s+/);
    const tokens = [];
    substrings.forEach(substring => {
        const l = length(substring);

        for (let i = 0; l - i >= 2; i++) {
            tokens.push(substr(substring, i, 2).toLowerCase());
        }
    });

    return [...new Set(tokens)]
}

function comparer (a,b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

/**
 *
 * @param {IDBIndex} index
 * @param {string} query
 * @returns {AsyncGenerator<*, void, *>}
 */
export async function* textSearch(index, query) {
    const terms = tokenize(query).sort(comparer);
    if (terms.length === 0) {return;}
    let cursor = await index.openCursor();

    while(terms.length > 0) {
        const term = terms.shift();
        if (cursor.key !== term)
            cursor = await cursor.continue(term);
        while (cursor) {
            if (cursor.key === term) {
                yield cursor.value;
                cursor = await cursor.continue();
            }
            else {
                break;
            }
        }
    }
}

function upgrade (db, oldVersion, newVersion, transaction, event) {
    const exercises = db.createObjectStore('exercises', {keyPath: 'name'});
    exercises.createIndex('kind', 'kind');
    exercises.createIndex('tokens', 'tokens', { multiEntry: true });

    const routines = db.createObjectStore('routines', {keyPath: 'name'});
    routines.createIndex('tokens', 'tokens', { multiEntry: true });
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
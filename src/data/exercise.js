import {Exercise as ExerciseModel} from "../models.js";
import {Db} from "./db.js";

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
            return await tx.store.get(row.name) || tx.store.add(row);
        })

        await Promise.all([
            ...adds,
            tx.done,
        ]);
    }

    /**
     // * @arg {number} page
     // * @returns  Promise<IDBCursorWithValue>
     */
    async all(page){
        const db = await Db();
        const cursor = await db.transaction(Store).store.openCursor();
        return cursor;
    }

    /**
     * @arg {string} name
     * @arg {number} page=0
     * @returns [{ExerciseModel}]
     */
    search(name, page=0) {

    }
}

const singleton = new Exercise();
export default singleton;
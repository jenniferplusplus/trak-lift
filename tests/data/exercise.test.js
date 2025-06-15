import test, {suite, before} from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import json from '../../public/exercises.json' with { type: 'json' };

import {Db} from "../../src/data/db.js";
import exercise from '../../src/data/exercise.js';

suite('Exercise', async () => {
    before(async () => {
        const db = await Db();
        const tx = db.transaction('exercises', 'readwrite');
        const adds = json.data.map(row => {
            return tx.store.add(row);
        })

        try {
            await Promise.all([
                ...adds,
                tx.done,
            ]);
        } catch (e) {
            console.log('Error in Exercise (before) =>', e);
        }
    });

    test('should iterate all exercises', async () => {
        let all = await exercise.all();
        assert.ok(all !== null);
        let count = 0;
        for await (const _ of all)
        {
            count++;
        }

        assert.ok(count === 151);
    })
})

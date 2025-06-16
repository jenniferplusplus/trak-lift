import test, {suite, before} from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import json from '../../public/exercises.json' with { type: 'json' };

import {Db, tokenize} from "../../src/data/db.js";
import exercise from '../../src/data/exercise.js';
import {Exercise} from "../../src/models.js";

suite('Exercise', async () => {
    before(async () => {
        const db = await Db();
        const tx = db.transaction('exercises', 'readwrite');
        const adds = json.data.map(row => {
            row.tokens = tokenize(row.name);
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

    test('should get an exercise by name', async () => {
       const result = await exercise.get('Zercher Squat');
       assert.ok(result.kind === 'weight', JSON.stringify(result));
    });

    test('should iterate all exercises', async () => {
        let all = await exercise.all();

        assert.ok(Array.isArray(all), typeof all);
        assert.ok(all.length === 151, all.length);
    });

    test('should search for exercises', async () => {
        const set = new Set();
        const matches = {};

        try {
            const results = await exercise.search('dumbell press');
            assert.ok(results);
            assert.ok(results.pages());
            const page = results.page();
            assert.ok(page.length === 5, JSON.stringify(page.map(e => e.name)))
            assert.ok(page !== results.page())
        } catch (e) {
            assert.fail(e);
        }
    });

    test('should add a new exercise', async () => {
        var ex = new Exercise();
        ex.name = 'Telekinesis';

        const result = await exercise.upsert(ex);
        assert.ok(result, JSON.stringify(result));
    });

    test('should remove an exercise', async () => {
        await assert.doesNotThrow(async () => await exercise.remove('Copenhagen Plank'));
    });
})

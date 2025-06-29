import test, {suite, before} from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';

import {Db, tokenize} from "../../src/data/db.js";
import routine from '../../src/data/routine.js';
import {ExerciseDistance, ExerciseEffort, ExerciseWeight, Routine} from "../../src/models.js";
import exercise from "../../src/data/exercise.js";

await suite('Routine', async () => {
    before(async () => {
        const db = await Db();
        const tx = db.transaction('routines', 'readwrite');

        const routine = Object.assign(new Routine(), {
            name: 'test routine',
            exercises: [
                Object.assign(new ExerciseWeight(), {
                    name: 'Big Lift'
                })
            ]
        });
        routine.tokens = tokenize(routine.name);

        try {
            await tx.store.add(routine);
        }
        catch (e) {
            console.log('Error in Routine (before) =>', e);
        }
    });

    test('should get a routine by name', async () => {
       const result = await routine.get('test routine');
       assert.ok(result.exercises.length === 1, JSON.stringify(result));
    });

    test('should not get an unknown routine', async () => {
        const result = await routine.get('does not exist');
        assert.ok(result === undefined);
    });

    test('should iterate all routines', async () => {
        let all = await routine.all();

        assert.ok(all.pages() === 1, all.pages());
    });

    test('should add a new routine', async () => {
        const expected = Object.assign(new Routine(), {
            name: 'new routine',
            exercises: [
                Object.assign(new ExerciseEffort(), {
                    name: 'Try Hard'
                }),
                Object.assign(new ExerciseDistance(), {
                    name: 'Run Fast'
                }),
            ]
        });
        await routine.upsert(expected);

        const actual = await routine.get('new routine');
        assert.ok(actual.name === 'new routine', JSON.stringify(actual));
        assert.ok(actual.exercises.length === 2, JSON.stringify(actual));
    });

    test('should update a routine', async () => {
        const expected = await routine.get('test routine');
        expected.exercises.push(Object.assign(new ExerciseWeight(), {name: 'Lift And Hold'}));
        await routine.upsert(expected);

        const actual = await routine.get('test routine');
        assert.ok(actual.name === 'test routine', JSON.stringify(actual));
        assert.ok(actual.exercises.length === 2, JSON.stringify(actual));
    });

    test('should search for routines', async () => {
        const set = new Set();
        const matches = {};

        try {
            const results = await routine.search('test');
            assert.ok(results);
            assert.ok(results.pages());
            const page = results.next();
            assert.ok(page.length === 1, JSON.stringify(page.map(e => e.name)))
            assert.ok(page !== results.next())
        } catch (e) {
            assert.fail(e);
        }
    });

    test('should remove a routine', async () => {
        await assert.doesNotThrow(async () => await routine.remove('test routine'));
    });
})

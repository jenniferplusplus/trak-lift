import test, {suite, before} from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';

import {Db} from "../../src/data/db.js";
import session from '../../src/data/session.js';
import {ExerciseDistance, ExerciseEffort, ExerciseWeight, Routine, Session} from "../../src/models.js";

await suite('Session', async () => {
    before(async () => {
        const db = await Db();
        const tx = db.transaction('sessions', 'readwrite');

        const sess = Object.assign(new Session(), {
            exercises: [
                Object.assign(new ExerciseWeight(), {
                    name: 'Big Lift'
                })
            ],
            id: 0,
            routine: 'Some Routine',
            start: Date.now()
        });

        try {
            await tx.store.add(sess);
        }
        catch (e) {
            console.log('Error in Sessions (before) =>', e);
        }
    });

    test('should get a session by id', async () => {
       const result = await session.get(0);
       assert.ok(result.exercises.length === 1, JSON.stringify(result));
    });

    test('should not get an unknown session', async () => {
        const result = await session.get(404);
        assert.ok(result === undefined);
    });

    test('should iterate all sessions', async () => {
        let all = await session.all();

        assert.ok(all.pages() === 1, all.pages());
    });

    test('should add a new session', async () => {
        const expected = Object.assign(new Session(), {
            exercises: [
                Object.assign(new ExerciseWeight(), {
                    name: 'Big Lift'
                }),
                Object.assign(new ExerciseEffort(), {
                    name: 'Try Hard'
                }),
            ],
            id: 1,
            routine: 'Some Other Routine',
            start: Date.now()
        });
        await session.upsert(expected);

        const actual = await session.get(1);
        assert.ok(actual.routine === expected.routine, JSON.stringify(actual));
        assert.ok(actual.exercises.length === expected.exercises.length, JSON.stringify(actual));
    });

    test('should update a session', async () => {
        const expected = await session.get(0);
        expected.exercises.push(Object.assign(new ExerciseWeight(), {name: 'Lift And Hold'}));
        await session.upsert(expected);

        const actual = await session.get(0);
        assert.ok(actual.routine === 'Some Routine', JSON.stringify(actual));
        assert.ok(actual.exercises.length === 2, JSON.stringify(actual));
    });

    await test('should search for sessions by date', async () => {
        const unexpected = Object.assign(new Session(), {
            exercises: [],
            id: 2,
            routine: 'Some Old Routine',
            start: Date.now() - 600_000  // 10 minutes ago
        });
        await session.upsert(unexpected);

        // 1 minute ago
        const results = await DoesNotThrowValue(async () => await session.searchByDate(Date.now() - 60_000, Date.now()));
        assert.ok(results);
        assert.ok(results.pages());
        const page = results.next();
        assert.ok(page.findIndex((value) => value.id === unexpected.id) === -1, JSON.stringify(page));
        assert.ok(page.find((value) => value.id === 0), JSON.stringify(page));

        assert.ok(page !== results.next())
    });

    await test('should search for sessions by routine', async () => {
        const unexpected = Object.assign(new Session(), {
            exercises: [],
            id: 3,
            routine: 'Some Old Routine',
            start: Date.now() - 660_000
        });
        await session.upsert(unexpected);

        const results = await DoesNotThrowValue(async () => await session.searchByRoutine('Some Routine'));
        assert.ok(results);
        assert.ok(results.pages());
        const page = results.next();
        assert.ok(page.findIndex((value) => value.id === unexpected.id) === -1, JSON.stringify(page));
        assert.ok(page.find((value) => value.id === 0), JSON.stringify(page));
        assert.ok(page !== results.next())
    });

    test('should remove a session', async () => {
        await assert.doesNotThrow(async () => await session.remove(0));
    });
})

async function DoesNotThrowValue(fn) {
    try {
        return await fn();
    }
    catch (e) {
        assert.fail(e);
    }
}

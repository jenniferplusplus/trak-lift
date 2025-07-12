import test, {suite, beforeEach, mock} from 'node:test';
import {ok} from "node:assert/strict";
import {Db} from "../../src/data/db.js";

import 'fake-indexeddb/auto';

import {Routine, Session, Exercise} from '../../src/models.js'
import {SingleSession} from "../../src/views/single-session.js";


await suite('onUpdateRoutine', async () => {
    const db = await Db();
    const routine = Object.assign(new Routine(), {
        name: 'My Routine'
    });

    await beforeEach(async () => {
        const tx = db.transaction('routines', 'readwrite');
        await tx.store.clear();
        await tx.store.add(routine);


    });

    test('should filter stop time', async () => {
        const expected = Object.assign(new Exercise(), {
            name: 'Big Lift',
            stop: Date.now() - 10,
        });
        const session = new SingleSession();
        session.data = new Session();
        session.data.routine = 'My Routine';
        session.data.exercises.push(expected);

        await session._onUpdateRoutine();
        const myRoutine = await db.transaction('routines').store.get('My Routine');
        const actual = myRoutine.exercises.find(e => e.name === 'Big Lift');
        ok(actual.stop === undefined, actual.stop)
    })
});
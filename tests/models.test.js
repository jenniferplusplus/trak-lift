import test, {suite, before} from 'node:test';
import {Exercise} from "../src/models.js";
import {ok} from "node:assert/strict";

const delay = ms => new Promise(res => setTimeout(res, ms));

await suite('Exercise', async () => {
    test('Not Started before Start', () => {
        const actual = new Exercise();
        ok(!Exercise.Started(actual), `now: ${Date.now()} val: ${JSON.stringify(actual)}`)
    });

    test('Started after Start', () => {
        const actual = new Exercise();
        Exercise.Start(actual);

        ok(Exercise.Started(actual), `now: ${Date.now()} val: ${JSON.stringify(actual)}`)
    });

    test('Not Stopped after Start', () => {
        const actual = new Exercise();
        Exercise.Start(actual);
        ok(!Exercise.Stopped(actual), `now: ${Date.now()} val: ${JSON.stringify(actual)}`)
    });

    test('Not Stopped before Stop', () => {
        const actual = new Exercise();
        ok(!Exercise.Stopped(actual), `now: ${Date.now()} val: ${JSON.stringify(actual)}`)
    });

    test('Stoped after Stop', () => {
        const actual = new Exercise();
        Exercise.Stop(actual);

        ok(Exercise.Started(actual), `now: ${Date.now()} val: ${JSON.stringify(actual)}`)
    });

    await test('Stoped after Start/Stop', async () => {
        const actual = new Exercise();
        Exercise.Start(actual);
        await delay(100);
        Exercise.Stop(actual);

        ok(Exercise.Started(actual), `now: ${Date.now()} val: ${JSON.stringify(actual)}`)
    });
});
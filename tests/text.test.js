import test, {suite} from 'node:test';
import {ok} from "node:assert/strict";
import {duration} from "../src/text.js";

await suite('Duration', async () => {
    test('0 seconds', () => {
        const actual = duration(0);
        ok(actual === '00:00', actual);
    });

    test('0.999 seconds', () => {
        const actual = duration(999);
        ok(actual === '00:00', actual);
    });

    test('1 second', () => {
        const actual = duration(1000);
        ok(actual === '00:01', actual);
    });

    test('10 seconds', () => {
        const actual = duration(10_000);
        ok(actual === '00:10', actual);
    });

    test('100 seconds', () => {
        const actual = duration(100_000);
        ok(actual === '01:40', actual);
    });

    test('600 seconds', () => {
        const actual = duration(600_000);
        ok(actual === '10:00', actual);
    });

    test('3,600 seconds', () => {
        const actual = duration(3_600_000);
        ok(actual === '01:00:00', actual);
    });

    test('90,000 seconds', () => {
        const actual = duration(90_000_000);
        ok(actual === '1 day 01:00:00', actual);
    });

    test('189,000 seconds', () => {
        const actual = duration(189_000_000);
        ok(actual === '2 days 04:30:00', actual);
    });
});
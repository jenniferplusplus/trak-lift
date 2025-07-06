import test, {suite, before} from 'node:test';
import assert from 'node:assert/strict';
import {base} from '../vite.config.js'

import Routes from "../src/routes.js";


suite('Routes', () => {
    test('should match session id', () => {
        assert.ok(Routes.match(`/session/0`));
    });

    test('should match session start routine', () => {
        assert.ok(Routes.match(`/session/start/some routine`));
    });

    test('should match session list', () => {
        assert.ok(Routes.match(`/sessions`));
    });

    test('should match routines list', () => {
        assert.ok(Routes.match(`/routines`));
    });

    test('should match routine name', () => {
        assert.ok(Routes.match(`/routine/some routine`));
    });

    test('should match new routine', () => {
        assert.ok(Routes.match(`/routine`));
    });
});
import test, {suite, before} from 'node:test';
import assert from 'node:assert/strict';

import Routes from "../src/routes.js";


suite('Routes', () => {
    test.skip('should match session id', () => {
        assert.ok(Routes.match(`/session/0`));
    });

    test.skip('should match session start routine', () => {
        assert.ok(Routes.match(`/session/start/some routine`));
    });

    test.skip('should match session list', () => {
        assert.ok(Routes.match(`/sessions`));
    });

    test.skip('should match routines list', () => {
        assert.ok(Routes.match(`/routines`));
    });

    test.skip('should match routine name', () => {
        assert.ok(Routes.match(`/routine/some routine`));
    });

    test.skip('should match new routine', () => {
        assert.ok(Routes.match(`/routine`));
    });
});
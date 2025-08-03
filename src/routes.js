import Navigo from 'navigo';
import Home from './routes/home.js';
import About from './routes/about.js';
import Exercises from './routes/manage-exercises.js';
import SingleExercise from './routes/single-exercise.js';
import Routines from './routes/manage-routines.js';
import SingleRoutine from './routes/single-routine.js';
import SingleSession from './routes/single-session.js';
import Sessions from './routes/manage-sessions.js'
import {base} from '../trak.config.js'

function Routes() {
    const router = new Navigo(base);

    return router
        .on('/routines', Routines)
        .on('/routine', SingleRoutine)
        .on('/routine/:name', SingleRoutine)
        .on('/session/start/:routine', (match) => SingleSession(match, true))
        .on('/session/:id', (match) => SingleSession(match, false))
        .on('/sessions', Sessions)
        .on('/exercises', Exercises)
        .on('/exercise/:name', SingleExercise)
        .on('/exercise', SingleExercise)
        .on('/', About)
        .on('/about', About);
}

const singleton = Routes();
export default singleton;

export function _onNavigate(evt) {
    evt.preventDefault();
    return singleton.navigate(evt.currentTarget?.pathname ?? evt.target.pathname)
}

export function navigate(path) {
    return singleton.navigate(path);
}
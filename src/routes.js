import Navigo from 'navigo';
import Home from './routes/home.js';
import About from './routes/about.js';
import Exercises from './routes/manage-exercises.js';
import SingleExercise from './routes/single-exercise.js';
import Routines from './routes/manage-routines.js';
import SingleRoutine from './routes/single-routine.js';

function Routes() {
    const router = new Navigo('/');

    return router
        .on('/routines', Routines)
        .on('/routine', SingleRoutine)
        .on('/routine/:name', SingleRoutine)
        .on('/session/start/:id', console.log)
        .on('/session/:id', console.log)
        .on('/sessions', console.log)
        .on('/exercises', Exercises)
        .on('/exercise/:name', SingleExercise)
        .on('/exercise', SingleExercise)
        .on('/', Home)
        .on('/about', About);
}

const singleton = Routes();
export default singleton;
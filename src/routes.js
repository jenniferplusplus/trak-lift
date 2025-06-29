import Navigo from 'navigo';
import Home from './routes/home.js';
import About from './routes/about.js';
import Exercises from './routes/manage-exercises.js';
import SingleExercise from './routes/single-exercise.js';

window.addEventListener("load", () => Routes().resolve());

export default function Routes() {
    const router = new Navigo('/');

    return router
        .on('/', Home)
        .on('/about', About)
        .on('/exercises', Exercises)
        .on('/exercise/:name', SingleExercise)
        .on('/exercise', SingleExercise);
}

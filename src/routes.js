import Navigo from 'navigo';
import Home from './routes/home.js';
import About from './routes/about.js';

window.addEventListener("load", () => Routes().resolve());

export default function Routes() {
    const router = new Navigo('/');

    return router
        .on('/', Home)
        .on('/about', About);
}
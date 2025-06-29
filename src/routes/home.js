import {Render} from "./index.js";

/**
 * Render the home view
 * @param {Match} match
 */
export default function home(match) {
    Render(`
        <h1>Welcome home!</h1>
        <a href="/about" data-navigo>About</a>
        <h2>todo</h2>
        <ol>
            <li><a href="/exercises" data-navigo>manage your exercises</a></li>
            <li>manage your routines</li>
            <li>start a session</li>
            <li>session history</li>
        </ol>
    `)
}
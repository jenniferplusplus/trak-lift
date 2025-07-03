import {Render} from "./index.js";
import {html} from "lit-html";

/**
 * Render the home view
 * @param {Match} match
 */
export default function home(match) {
    Render(html`
        <h1>Welcome home!</h1>
        <a href="/about" data-navigo>About</a>
        <h2>todo</h2>
        <ol>
            <li><a href="/exercises" data-navigo>manage your exercises</a></li>
            <li><a href="/routines" data-navigo>manage your routines</a></li>
            <li>start a session</li>
            <li>session history</li>
        </ol>
    `);
}
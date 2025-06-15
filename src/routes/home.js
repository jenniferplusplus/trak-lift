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
            <li>manage your routines</li>
            <li>start a session</li>
            <li>session history</li>
            <li>manage your exercises</li>
        </ol>
        <my-element>hey</my-element>
    `)
}
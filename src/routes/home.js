import {Render} from "./index.js";

/**
 * Render the home view
 * @param {Match} match
 */
export default function home(match) {
    Render(`
        <h1>Welcome home!</h1>
        <a href="/about" data-navigo>About</a>
    `)
}
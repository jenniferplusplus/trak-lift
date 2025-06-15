import {Render} from "./index.js";
import {html} from "lit";

/**
 * Render the about view
 * @param {Match} match
 */
export default function about(match) {
    Render(`
        <h1>Welcome about!</h1>
    `);
}
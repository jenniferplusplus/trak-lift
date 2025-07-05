import {Render} from "./index.js";
import {html} from "lit";

/**
 * Render the about view
 * @param {Match} match
 */
export default function about(match) {
    Render(html`
        <about-view></about-view>
    `);
}
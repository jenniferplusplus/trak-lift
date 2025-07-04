import {Render} from "./index.js";
import {html} from "lit-html";

/**
 * Render the home view
 * @param {Match} match
 */
export default function home(match) {
    Render(html`
        <home-view></home-view>
    `);
}
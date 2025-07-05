import {Render} from "./index.js";
import {html} from "lit-html";

export default function sessions(match) {
    Render(html`
    <manage-sessions></manage-sessions>
    `);
}
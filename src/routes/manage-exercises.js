import {Render} from "./index.js";
import {html} from "lit-html";

export default function manage(match) {
    Render(html`
    <manage-exercises></manage-exercises>
    `);
}
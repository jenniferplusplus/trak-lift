import {Render} from "./index.js";
import {html} from "lit-html";

export default function routines(match) {
    Render(html`
    <manage-routines></manage-routines>
    `);
}
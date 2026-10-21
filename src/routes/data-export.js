import {Render} from "./index.js";
import {html} from "lit-html";

export default function dataExport(match) {
    Render(html`
    <data-export></data-export>
    `);
}
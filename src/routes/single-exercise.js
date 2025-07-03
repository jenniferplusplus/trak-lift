import {Render} from "./index.js";
import {html} from "lit-html";

export default function single(match) {
    Render(html`
    <single-exercise name="${match.data?.name ?? ""}"></single-exercise>
    `);
}
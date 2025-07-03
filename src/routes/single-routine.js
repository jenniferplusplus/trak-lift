import {Render} from "./index.js";
import {html} from "lit-html";

export default function single(match) {
    Render(html`
    <single-routine name="${match.data?.name ?? ""}"></single-routine>
    `);
}
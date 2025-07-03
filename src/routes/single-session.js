import {Render} from "./index.js";
import {nothing, html} from "lit";

export default function single(match, start) {
    Render(html`
        <single-session routine="${match.data?.routine ?? nothing}" id="${match.data?.id ?? nothing}"
                        start="${!!start || nothing}"></single-session>
    `);
}
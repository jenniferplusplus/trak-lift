import {Render} from "./index.js";

export default function single(match) {
    Render(`
    <single-routine name="${match.data?.name ?? ""}"></single-routine>
    `);
}
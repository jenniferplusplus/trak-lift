import {Render} from "./index.js";

export default function single(match) {
    Render(`
    <single-exercise name="${match.data?.name ?? ""}"></single-exercise>
    `);
}
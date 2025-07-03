import {render, html} from 'lit-html';

export function Render(d) {
    render(d, document.querySelector("#app"));
}
import {TrakElement} from "../elements/trak-element.js";
import SessionRepo from '../data/session.js';
import {html} from "lit-html";
import {repeat} from "lit/directives/repeat.js";

export class ManageSessions extends TrakElement {
    static get properties() {
        return {
            data: {type: Object, attribute: false},
            page: {type: Array, attribute: false},
            error: {type: String, attribute: false}
        }
    }

    constructor() {
        super();

        this.data = undefined;
        this.page = undefined;
        this.error = undefined;

        SessionRepo.all()
            .then((v) => {
                this.data = v;
                this.page = v.next();
            })
            .catch((e) => {
                this.error = e.message ?? e;
            });
    }

    render() {
        if (this.page === undefined) return;
        return html`<dl>
            ${repeat(this.page, (each) => html`<session-list-widget .data="${each}"></session-list-widget>`) }
        </dl>`
    }
}

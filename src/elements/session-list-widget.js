import {TrakElement} from "./trak-element.js";
import SessionsRepo from "../data/session.js";
import {html} from "lit-html";
import {nothing} from "lit";
import {repeat} from "lit/directives/repeat.js";
import {Exercise} from "../models.js";
import {duration} from "../text.js";
import SessionRepo from "../data/session.js";
import {ManageSessions} from "../views/manage-sessions.js";

export class SessionListWidget extends TrakElement {
    static get properties() {
        return {
            id: {type: Number},
            data: {type: Object},
            error: {type: String, attribute: false}
        }
    }

    constructor() {
        super();

        this.id = undefined;
        this.data = undefined;
        this.error = undefined;
        this._tick = undefined;
    }

    async _onFinish(evt) {
        this.data.start ??= this.data.exercises.map(ex => ex.start).sort()[0] ?? Date.now();
        this.data.stop = Date.now();
        await SessionRepo.upsert(this.data);
        if (this._tick !== undefined)
            window.clearInterval(this._tick);
        this.requestUpdate('data');
    }

    connectedCallback() {
        super.connectedCallback();
        if (Exercise.Started(this.data) && !Exercise.Stopped(this.data))
            this._tick = window.setInterval(() => {
                this.requestUpdate('data');
            }, 1000)
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._tick !== undefined)
            window.clearInterval(this._tick);
    }

    // connectedCallback() {
    //     super.connectedCallback();
    //     SessionsRepo.get(this.id)
    //         .then((v) => {
    //             this.data = v;
    //         })
    //         .catch(e => {
    //             this.error = e
    //         });
    // }

    render() {
        if (this.error !== undefined)
            return html`<p class="error-message">Couldn't load session: ${this.error}</p>`;
        if (this.data === undefined)
            return html`<dt>Session not found</dt>`

        const state = () => {
            if (Exercise.Stopped(this.data))
                return html`<span> ✅ <span class="time">${duration(this.data.stop - this.data.start)}</span></span>`;
            if (Exercise.Started(this.data))
                return html`<span> ⬅️ <span class="time">${duration(Date.now() - this.data.start)}</span></span>`;
        };

        return html`
            <div class="control-row">
                <dt class="end-controls">
                    <div class="vertical">
                        <span>
                            <a href="/session/${this.data.id}" data-navigo>
                                ${!!this.data.start ? html`<span>${new Date(this.data.start).toLocaleDateString()}</span>` : 'Not Started'}
                            </a> ${state()}
                        </span>
                    ${!!this.data.routine ? html`<span>${this.data.routine}</span>` : nothing}
                    </div>
                    <span class="controls">${Exercise.Started(this.data) && !Exercise.Stopped(this.data) 
                            ? html`<button @click="${this._onFinish}">Finish</button>` 
                            : nothing}
                    </span>
                </dt>
                ${repeat(this.data.exercises, (ex) => html`
                        <dd>${ex.name}</dd>`)}
            </div>`;
    }
}
window.customElements.define('session-list-widget', SessionListWidget);

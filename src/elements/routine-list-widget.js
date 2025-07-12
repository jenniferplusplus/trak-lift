import {TrakElement} from "./trak-element.js";
import {html} from "lit";
import {repeat} from "lit/directives/repeat.js";
import Routes, {_onNavigate} from "../routes.js";
import RoutinesRepo from '../data/routine.js';
import {base} from '../../trak.config.js';

export class RoutineListWidget extends TrakElement {
    static get properties() {
        return {
            name: {type: String},
            data: {type: Object, attribute: false},
            error: {type: String, attribute: false}
        }
    }

    constructor() {
        super();

        this.name = undefined;
        this.data = undefined;
        this.error = undefined;
    }

    _onStart(name) {
        Routes.navigate(`/session/start/${name}`);
    }

    connectedCallback() {
        super.connectedCallback();
        RoutinesRepo.get(this.name)
            .then((v) => {
                this.data = v;
            })
            .catch(e => {
                this.error = e
            });
    }

    render() {
        if (this.error !== undefined)
            return html`<p class="error-message">couldn't load routines: ${this.error}</p>`;
        if (this.data === undefined)
            return html`<dt>loading</dt>`
        return html`
                <div>
                    <dt class="end-controls">
                        <a href="/routine/${this.data.name}" @click="${_onNavigate}" data-navigo>${this.data.name}</a>
                        <span class="controls"><button @click="${() => this._onStart(this.data.name)}">Start</button></span>
                    </dt>
                    ${repeat(this.data.exercises, (ex) => html`
                        <dd>${ex.name}</dd>`)}
                </div>
            `;
    }
}


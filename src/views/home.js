import RoutineRepo from '../data/routine.js';
import SessionRepo from '../data/session.js';
import {TrakElement} from "../elements/trak-element.js";
import {html} from "lit-html";
import {Paged} from "../data/types.js";
import Routes, {_onNavigate} from "../routes.js";

export class Home extends TrakElement {
    static get properties() {
        return {
            routines: {attribute: false},
            session: {attribute: false},
            routinePage: {attribute: false},
            sessionPage: {attribute: false},
        }
    }

    constructor() {
        super();
        this.routines = new Paged();
        this.sessions = new Paged();
        this.routinePage = [];
        this.sessionPage = [];
    }

    connectedCallback() {
        super.connectedCallback();
        RoutineRepo.all().then(v => {
            this.routines = v;
            this.routinePage = this.routines.next();
        }).catch(console.error);

        SessionRepo.last(1).then(v => {
            if (v.length > 0) {
                this.session = v[0];
            }
        }).catch(console.error);
    }

    _onStart(name) {
        Routes.navigate(`/session/start/${name}`);
    }

    render() {
        return html`
            <trak-whats-new-widget></trak-whats-new-widget>
            ${!!this.session
                    ? html`
                        <section>
                            <h2>Last Session</h2>
                            <session-list-widget .data="${this.session}"></session-list-widget>
                        </section>`
                    : html``
            }
            ${this.routinePage.length > 0
                    ? html`
                        <section>
                            <h2>Quick Start</h2>
                            <p>Start one of your routines</p>
                            <dl>
                                ${this.routinePage.map(i => html`
                                    <dt class="end-controls control-row">
                                        <span><a href="/routine/${i.name}" @click="${_onNavigate}"
                                                 data-navigo>${i.name}</a></span>
                                        <span class="controls">
                                    <button @click="${() => this._onStart(i.name)}">Start</button>
                                </span>
                                    </dt>
                                `)}
                            </dl>
                        </section>`
                    : html`
                        <trak-getting-started-widget></trak-getting-started-widget>`}
        `
    }
}

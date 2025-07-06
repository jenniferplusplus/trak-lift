import {TrakElement} from "./trak-element.js";
import {html} from "lit-html";
import {base} from '../../trak.config.js';
import Routes, {_onNavigate} from "../routes.js";

export class TrakHeader extends TrakElement {
    static get properties() {
        return {
            page: {type: String, attribute: false}
        }
    }

    constructor() {
        super();

        this.page = undefined;
    }

    async getUpdateComplete() {
        const result = await super.getUpdateComplete();
        console.log('trak-header', 'getUpdateComplete');

        return result;
    }

    setPage() {
        if (window.location.pathname.startsWith(`${base}about`)) {
            this.page = 'about';
        } else if (window.location.pathname.startsWith(`${base}routine`)) {
            this.page = 'routine';
        } else if (window.location.pathname.startsWith(`${base}exercise`)) {
            this.page = 'exercise';
        } else if (window.location.pathname.startsWith(`${base}session`)) {
            this.page = 'session';
        } else {
            this.page = 'home';
        }
    }

    _onNavigate(evt) {
        _onNavigate(evt);
        this.setPage();
    }

    connectedCallback() {
        super.connectedCallback();
        this.setPage();

        window.addEventListener('popstate', (evt) => {
            console.log('trak-header popstate', evt);
            this.setPage();
        });

    }

    render() {
        return html`
            <header>
                <nav>
                    <ul>
                        <li><h1><a href="/" @click="${this._onNavigate}" class="contrast" data-navigo>Trak Lift</a></h1></li>
                    </ul>
                    <ul>
                        <li><a href="/about" @click="${this._onNavigate}" class="${this.page === 'about' ? 'nav-focus' : ''}" data-navigo>Help</a></li>
                        <li><a href="/exercises" @click="${this._onNavigate}" class="${this.page === 'exercise' ? 'nav-focus' : ''}" data-navigo>Exercises</a></li>
                        <li><a href="/routines" @click="${this._onNavigate}" class="${this.page === 'routine' ? 'nav-focus' : ''}" data-navigo>Routines</a></li>
                        <li><a href="/sessions" @click="${this._onNavigate}" class="${this.page === 'session' ? 'nav-focus' : ''}" data-navigo>Sessions</a></li>
                    </ul>
                </nav>
            </header>`;
    }
}

window.customElements.define('trak-header', TrakHeader)
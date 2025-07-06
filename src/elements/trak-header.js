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

    connectedCallback() {
        super.connectedCallback();
        const setPage = () => {
            if (window.location.pathname.startsWith('/about')) {
                this.page = 'about';
            } else if (window.location.pathname.startsWith('/routine')) {
                this.page = 'routine';
            } else if (window.location.pathname.startsWith('/exercise')) {
                this.page = 'exercise';
            } else if (window.location.pathname.startsWith('/session')) {
                this.page = 'session';
            } else {
                this.page = 'home';
            }
        }
        setPage();

        window.addEventListener('popstate', function (evt) {
            console.log('trak-header popstate', evt);
            setPage();
        });

    }

    render() {
        return html`
            <header>
                <nav>
                    <ul>
                        <li><h1><a href="/" @click="${_onNavigate}" class="contrast" data-navigo>Trak Lift</a></h1></li>
                    </ul>
                    <ul>
                        <li><a href="/about" @click="${_onNavigate}" class="${this.page === 'about' ? 'nav-focus' : ''}" data-navigo>Help</a></li>
                        <li><a href="/exercises" @click="${_onNavigate}" class="${this.page === 'exercise' ? 'nav-focus' : ''}" data-navigo>Exercises</a></li>
                        <li><a href="/routines" @click="${_onNavigate}" class="${this.page === 'routine' ? 'nav-focus' : ''}" data-navigo>Routines</a></li>
                        <li><a href="/sessions" @click="${_onNavigate}" class="${this.page === 'session' ? 'nav-focus' : ''}" data-navigo>Sessions</a></li>
                    </ul>
                </nav>
            </header>`;
    }
}

window.customElements.define('trak-header', TrakHeader)
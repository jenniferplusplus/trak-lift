import {TrakElement} from "./trak-element.js";
import {html} from "lit-html";
import {base} from '../../vite.config.js';

export class TrakHeader extends TrakElement {
    static get properties() {
        return {
            page: {type: String, attribute: false}
        }
    }

    constructor() {
        super();

        console.log('trak-header')
        this.page = undefined;
        this._controller = undefined;
    }
    connectedCallback() {
        super.connectedCallback();
        console.log('trak-header connected');
        const setPage = () => {
            console.log('trak-header setPage');
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

        // this._controller = new AbortController();
        window.addEventListener('popstate', function (evt) {
            console.log('trak-header popstate', evt);
            setPage();
        });

    }

    // disconnectedCallback() {
    //     super.disconnectedCallback();
    //     if(this._controller !== undefined)
    //         this._controller.abort();
    // }

    render() {
        return html`
            <header>
                <nav>
                    <ul>
                        <li><h1><a href="${base}" class="contrast" data-navigo>Trak Lift</a></h1></li>
                    </ul>
                    <ul>
                        <li><a href="${base}about" class="${this.page === 'about' ? 'nav-focus' : ''}" data-navigo>Help</a></li>
                        <li><a href="${base}exercises" class="${this.page === 'exercise' ? 'nav-focus' : ''}" data-navigo>Exercises</a></li>
                        <li><a href="${base}routines" class="${this.page === 'routine' ? 'nav-focus' : ''}" data-navigo>Routines</a></li>
                        <li><a href="${base}sessions" class="${this.page === 'session' ? 'nav-focus' : ''}" data-navigo>Sessions</a></li>
                    </ul>
                </nav>
            </header>`;
    }
}

window.customElements.define('trak-header', TrakHeader)
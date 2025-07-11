import {TrakElement} from "./trak-element.js";
import {html, nothing} from "lit";
import {repeat} from 'lit/directives/repeat.js';
import Routines from '../data/routine.js';
import {Paged} from "../data/types.js";
import Routes, {_onNavigate} from '../routes.js'
import {base} from '../../trak.config.js';

export class ManageRoutines extends TrakElement {

    static get properties() {
        return {
            data: {type: Object, attribute: false},
            page: {type: Array, attribute: false},
            count: {type: Number, attribute: false},
            pageNumber: {type: Number, attribute: false},
        }
    }

    constructor() {
        super();
        this.data = new Paged();
        this.page = [];
        this.count = 0;
        this.pageNumber = 0;
    }

    connectedCallback() {
        super.connectedCallback();
        Routines.all()
            .then(v => {
                this.data = v;
                this.page = this.data.next();
                this.all = v;
            })
            .catch(e => {
                console.error(e)
            });
    }

    _onNext() {
        if (this.pageNumber >= this.data.pages()) return;
        this.pageNumber++;
        this.page = this.data.next(this.pageNumber);
    }

    _onBack() {
        if (this.pageNumber <= 0) return;
        this.pageNumber--;
        this.page = this.data.next(this.pageNumber);
    }

    /**
     *
     * @param {InputEvent} evt
     * @returns {Promise<void>}
     * @private
     */
    async _onSearch(evt) {
        const query = evt.target.value;
        let results;
        if (query.length <= 1) {
            results = this.all;
            this.data = results;
            this.page = results.next(0);
        } else {
            results = await Routines.search(query);
            this.data = results;
            this.page = results.next();
        }
        this.pageNumber = 0;
    }

    render() {
        return html`
            <div>
                <p>Page: ${this.pageNumber + 1} of ${this.data.pages()}</p>
                <button @click="${this._onBack}" disabled="${this.pageNumber > 0 ? nothing : ""}">Back</button>
                <button @click="${this._onNext}" disabled="${this.pageNumber + 1 < this.data.pages() ? nothing : ""}">
                    Next
                </button>
            </div>
            <p><a href="/routine" @click="${_onNavigate}" data-navigo>new routine</a></p>
            <div>
                <label>
                    Search
                    <input type="search" @input="${this._onSearch}">
                </label>
            </div>
            <dl>
                ${repeat(this.page, (each) => html`<routine-list-widget name="${each.name}"></routine-list-widget>`)}
            </dl>
        `;
    }
}


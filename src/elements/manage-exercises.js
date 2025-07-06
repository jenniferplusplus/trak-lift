import {TrakElement} from "./trak-element.js";
import {html, nothing} from "lit";
import { repeat } from 'lit/directives/repeat.js';
import Exercise from "../data/exercise.js";
import {Paged} from "../data/types.js";
import {base} from '../../trak.config.js';
import {_onNavigate} from "../routes.js";

export class ManageExercises extends TrakElement {
    static get properties() {
        return {
            data: { },
            page: { },
            count: { type: Number },
            pageNumber: {type: Number },
        }
    }

    constructor() {
        super();
        this.data = new Paged();
        this.page = [];
        this.count = 0;
        this.pageNumber = 0;
        Exercise.all().then(v => {
            this.data = v;
            this.page = this.data.next();
            this.all = v;
            this.render();

        })
            .catch(console.error);
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

    async _onDownload() {
        await Exercise.reload();
        const v = await Exercise.all();
        this.data = v;
        this.page = this.data.next();
        this.all = v;
        this.requestUpdate();
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
        }
        else {
            results = await Exercise.search(query);
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
                <button @click="${this._onNext}" disabled="${this.pageNumber + 1 < this.data.pages() ? nothing : ""}">Next</button>
                <button @click="${this._onDownload}">Download</button>
            </div>
            <p><a href="/exercise" @click="${_onNavigate}" data-navigo>new exercise</a></p>
            <div>
                <label>
                    Search
                    <input type="search" @input="${this._onSearch}">
                </label>
            </div>
            <dl>
                ${repeat(this.page, (each) => each.name, exerciseTemplate)}
            </dl>
        `;

        function exerciseTemplate(each, i) {
            const kind = () => {
                switch (each.kind) {
                    default:
                    case 'exercise':
                        return html`<span class="emoji">💪</span> <span>generic exercise</span>`;
                    case 'weight':
                        return html`<span class="emoji">🏋️</span> <span>weight, reps, and sets</span>`;
                    case 'count':
                        return html`<span class="emoji">🧎</span> <span>reps, and sets</span>`;
                    case 'distance':
                        return html`<span class="emoji">🏃</span> <span>distance traveled</span>`;
                    case 'effort':
                        return html`<span class="emoji">🧘</span> <span>subjective effort</span>`;
                }
            }
            return html`<div>
                <dt><a href="/exercise/${each.name}" @click="${_onNavigate}" data-navigo>${each.name}</a></dt>
                <dd><div>${kind()}</div></dd>
                ${each.guide ? html`<dd><a href="${each.guide}">guide</a></dd>` : ''}
                </div>`;
        }
    }
}

window.customElements.define('manage-exercises', ManageExercises);

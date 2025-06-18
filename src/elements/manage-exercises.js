import {TrakElement} from "./trak-element.js";
import {html} from "lit";
import { repeat } from 'lit/directives/repeat.js';
import {Task} from '@lit/task';
import Exercise, {Paged} from "../data/exercise.js";

export class ManageExercises extends TrakElement {
    static get properties() {
        return {
            // data: {type: Paged },
            page: { },
            count: { type: Number }
        }
    }

    constructor() {
        super();
        this.data = new Paged();
        this.page = [];
        this.count = 0;
        console.log('constructor');
        Exercise.all().then(v => {
            this.data = v;
            this.page = this.data.next();
            console.log('page', this.page?.length)
            this.all = v;
            console.log('all', this.data.pages());
            this.render();

        })
            .catch(console.error);
    }

    _onClick() {
        this.count++;
        console.log('_onClick', this.count);
    };

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
        console.log('search page', this.page?.length)
    }
    // _search = debounce(this._onSearch, 50);

    render() {
        this.init();
        return html`
            <p>Page: ${this.data.page()} of ${this.data.pages()}</p>
            <div>
                <label>
                    Search
                    <input type="text" @input="${this._onSearch}">
                </label>
            </div>
            <dl>
                ${repeat(this.page, (each) => each.name, exerciseTemplate)}
            </dl>

            <p>Count: ${this.count}</p>
            <button @click=${this._onClick} part="button">click!</button>
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
                <dt>${each.name}</dt>
                <dd><div>${kind()}</div></dd>
                ${each.guide ? html`<dd><a href="${each.guide}">guide</a></dd>` : ''}
                </div>`;
        }
    }
}

window.customElements.define('manage-exercises', ManageExercises);

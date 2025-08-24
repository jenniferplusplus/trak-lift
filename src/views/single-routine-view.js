import {html, nothing} from "lit";

import {TrakElement} from "../elements/trak-element.js";
import ExerciseRepo from '../data/exercise.js'
import RoutineRepo from '../data/routine.js';
import {Exercise, ExerciseDistance, ExerciseEffort, ExerciseWeight, Routine} from "../models.js";
import {repeat} from "lit/directives/repeat.js";
import {_onNavigate, navigate} from "../routes.js";

export class SingleRoutineView extends TrakElement {
    static get properties() {
        return {
            name: {type: String, reflect: true},
            data: {attribute: false},
            saved: {type: Boolean, attribute: false},
            error: {type: String, attribute: false},
            searchResults: {attribute: false}
        }
    }

    constructor() {
        super();
        this.data = undefined;
        this.status = 'not found';
        this.saved = false;
        this.error = '';
        this.searchResults = [];
    }

    async lookup() {
        try {
            this.data = await RoutineRepo.get(this.name);
            this.status = 'found';
        } catch (e) {
            console.error(e)
            this.data = new Routine();
        }
    }

    _onChangeName(evt) {
        this.name = evt.target.value;
        this.data.name = this.name;
        this.saved = false;
        this.error = '';
    }

    async _onChangeSearch(evt) {
        const query = evt.target.value;
        if (query.length <= 1) {
            this.searchResults = [];
            return;
        }
        const results = await ExerciseRepo.search(evt.target.value);
        this.searchResults = results.next();
    }

    /**
     * @param {ExerciseEffort} ex
     * @param evt
     * @private
     */
    _onChangeEffort(ex, evt) {
        ex.effort = parseFloat(evt.target.value);
    }

    /**
     * @param {ExerciseDistance} ex
     * @param evt
     * @private
     */
    _onChangeDistance(ex, evt) {
        ex.distance = parseFloat(evt.target.value);
    }

    /**
     * @param {ExerciseWeight} ex
     * @param evt
     * @private
     */
    _onChangeWeight(ex, evt) {
        ex.weight = parseInt(evt.target.value);
    }

    /**
     * @param {ExerciseWeight} ex
     * @param evt
     * @private
     */
    _onChangeReps(ex, evt) {
        ex.reps = parseInt(evt.target.value);
    }

    /**
     * @param {ExerciseWeight} ex
     * @param evt
     * @private
     */
    _onChangeSets(ex, evt) {
        ex.sets = parseInt(evt.target.value);
    }

    async _onAdd(ex) {
        this.data.exercises = [...this.data.exercises, ex];
        this.requestUpdate('data');
    }

    async _onSave() {
        try {
            await RoutineRepo.upsert(this.data);
            this.saved = true;
        } catch (e) {
            console.error(e);
            this.error = e.message ?? e
        }
    }

    async _onDelete() {
        try {
            await RoutineRepo.remove(this.data.name);
            await navigate('/routines');
        } catch (e) {
            console.error(e);
            this.error = e.message ?? e
        }
    }

    /**
     * @param evt {Event}
     * @returns {Promise<void>}
     * @private
     */
    async _onRemove(evt) {
        this.data.exercises.splice(this.data.exercises.indexOf(evt.data), 1);
        this.requestUpdate('data');
    }

    /**
     * @param evt {Event}
     * @returns {Promise<void>}
     * @private
     */
    async _onUpdated(evt) {
        if (Array.isArray(evt.data)) {
            this.data.exercises = evt.data;
            this.requestUpdate('data');
        }
        else
            console.warn('updated.data is not an array', evt.data);
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.name === '') {
            this.data = new Routine();
            this.status = 'new';
        } else {
            this.lookup().catch(console.error);
        }
    }

    render() {
        if (this.status === 'not found')
            return html`
                <p>not found</p>
                <p><a href="/routine" @click="${_onNavigate}" data-navigo>add new routine</a></p>`;

        return html`
            <h1>${this.renderName()}</h1>
            <trak-exercise-data-list .data="${this.data.exercises}" .mode="edit" @remove="${this._onRemove}" @updated="${this._onUpdated}"></trak-exercise-data-list>
            <div>
                <button @click="${this._onSave}">Save</button>
                ${this.saved ? html` ✅` : ''}
                <p class="error-message">${this.error}</p>
            </div>
            <div class="ui-row">
                <button @click="${this._onDelete}" class="secondary"
                disabled="${(this.status !== 'found' && !this.saved) || nothing}">Delete</button>
            </div>
            <div>
                <label>Add Exercise
                    <input @input="${this._onChangeSearch}" type="search"/>
                </label>
                <ul class="search-results">${repeat(this.searchResults, (ex) => searchResultTemplate(this, ex))}</ul>
            </div>`;
    }

    renderName() {
        if (this.status === 'found')
            return html`${this.data.name}`;
        return html`<label>Name
            <input @input="${this._onChangeName}" placeholder="Name Your New Routine" type="text"/>
        </label>`;
    }
}

/**
 * @param {SingleRoutineView} thisArg
 * @param ex
 */
function searchResultTemplate(thisArg, ex) {
    return html`
        <li class="end-controls">
            <span>${ex.name}</span>
            <span class="controls">
                <button type="button" @click="${() => thisArg._onAdd(ex)}" class="inline-btn">Add</button>
            </span>
        </li>`
}


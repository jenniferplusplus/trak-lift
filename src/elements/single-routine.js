import {TrakElement} from "./trak-element.js";
import {html, nothing} from "lit";
import ExerciseRepo from '../data/exercise.js'
import RoutineRepo from '../data/routine.js';
import {Exercise, ExerciseDistance, ExerciseEffort, ExerciseWeight, Routine} from "../models.js";
import {repeat} from "lit/directives/repeat.js";

export class SingleRoutine extends TrakElement {
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
        this.data.exercises.push({...ex});
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

    async _onRemove(ex) {
        this.data.exercises.splice(this.data.exercises.indexOf(ex), 1);
        this.requestUpdate('data');
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
                <p><a href="/routine" data-navigo>add new routine</a></p>`;

        return html`
            <h1>${this.renderName()}</h1>
            <dl>
                ${repeat(this.data.exercises, (ex, i) => exerciseTemplate(this, ex, i))}
            </dl>
            <div>
                <label>Add Exercise
                    <input @input="${this._onChangeSearch}" type="search"/>
                </label>
                <ul class="search-results">${repeat(this.searchResults, (ex) => searchResultTemplate(this, ex))}</ul>
            </div>
            <div>
                <button @click="${this._onSave}">Save</button>
                ${this.saved ? html` ✅` : ''}
                <p class="error-message">${this.error}</p>
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
 *
 * @param {SingleRoutine} thisArg
 * @param {Exercise} ex
 * @returns {TemplateResult<1>}
 */
function exerciseTemplate(thisArg, ex, i) {
    return html`
        <div class="control-row">
            <dt class="end-controls">
                <span class="title">${ex.name}</span>
                <span class="controls">
                <button class="inline-btn secondary" @click="${() => thisArg._onRemove(ex)}">Remove</button>
            </span>
            </dt>
            <dd class="inline-controls">${exerciseDetails(thisArg, ex, i)}</dd>
        </div>`;
}

/**
 * @param {SingleRoutine} thisArg
 * @param {Exercise} ex
 * @param {Number} i
 */
function exerciseDetails(thisArg, ex, i) {
    switch (ex.kind) {
        default:
        case 'exercise':
            return html``;
        case 'weight':
            return exWeightControls(thisArg, ex, i);
        case 'effort':
            return exEffortControls(thisArg, ex, i);
        case 'distance':
            return exDistanceControls(thisArg, ex, i);
    }
}

function exEffortControls(thisArg, ex, i) {
    return html`<span>
        <label class="fit-size" for="in-eff-${i}">Effort</label>
        <input id="in-eff-${i}" class="fit-size" size="4" value="${ex.effort}"
               @change="${(evt) => thisArg._onChangeEffort(ex, evt)}"/>
    </span>`
}

function exDistanceControls(thisArg, ex, i) {
    return html`<span>
        <label class="fit-size" for="in-dist-${i}">Distance</label>
        <input id="in-dist-${i}" class="fit-size" size="4" value="${ex.distance}"
               @change="${(evt) => thisArg._onChangeDistance(ex, evt)}"/>
    </span>`
}

function exWeightControls(thisArg, ex, i) {
    return html`<span>
        <label class="fit-size" for="in-weight-${i}">Weight</label>
        <input id="in-weight-${i}" class="fit-size" size="4" value="${ex.weight}"
               @change="${(evt) => thisArg._onChangeWeight(ex, evt)}"/>
    </span>
    <span>
        <label for="in-reps-${i}" class="fit-size">Reps</label>
        <input id="in-reps-${i}" class="fit-size" size="4" value="${ex.reps}"
               @change="${(evt) => thisArg._onChangeReps(ex, evt)}"/>
    </span>
    <span>
        <label for="in-sets-${i}" class="fit-size">Sets</label>
        <input id="in-sets-${i}" class="fit-size" size="4" value="${ex.sets}"
               @change="${(evt) => thisArg._onChangeSets(ex, evt)}"/>
    </span>`
}

/**
 * @param {SingleRoutine} thisArg
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

window.customElements.define('single-routine', SingleRoutine);
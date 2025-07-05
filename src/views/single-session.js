import {TrakElement} from "../elements/trak-element.js";
import {html, nothing} from "lit";
import RoutineRepo from '../data/routine.js';
import SessionRepo from '../data/session.js';
import ExerciseRepo from '../data/exercise.js';
import {Exercise, ExerciseDistance, ExerciseEffort, ExerciseWeight, Routine, Session} from "../models.js";
import {repeat} from "lit/directives/repeat.js";
import {defaultValue, duration} from '../text.js';

export class SingleSession extends TrakElement {
    static get properties() {
        return {
            routine: {type: String},
            start: {type: Boolean},
            id: {type: Number},
            saved: {type: Boolean, attribute: false},
            editMode: {type: Boolean, attribute: false},
            modified: {type: Boolean, attribute: false},
            error: {type: String, attribute: false},
            data: {type: Object, attribute: false},
            searchResults: {type: Array, attribute: false}
        }
    }

    constructor() {
        super();
        this.data = undefined;
        this.status = 'not found';
        this.routine = undefined;
        this.id = undefined;
        this.start = false;
        this.saved = false;
        this.modified = false;
        this.error = '';
        this.searchResults = [];
    }

    async lookupRoutine() {
        try {
            const routine = await RoutineRepo.get(this.routine);
            this.data = new Session();
            this.data.routine = routine.name;
            this.data.exercises = routine.exercises;
            this.status = 'new';
        } catch (e) {
            console.error(e)
            this.data = new Session();
        }
    }

    async lookupSession() {
        try {
            this.data = await SessionRepo.get(this.id);
            this.status = 'found';
        } catch (e) {
            console.error(e)
            this.data = new Session();
        }
    }

    async saveSession() {
        try {
            this.data.stop ??= Number.MAX_SAFE_INTEGER;
            const id = await SessionRepo.upsert(this.data);
            this.data.id = id;
            this.found = true;
        } catch (e) {
            console.error(e);
            this.error = e.message ?? e
        }
    }

    _onEdit() {
        this.editMode = !this.editMode;
    }

    _onStart(ex) {
        Exercise.Start(ex);
        this.data.start ??= ex.start;
        this.requestUpdate('data');
        this.saveSession();
    }

    _onStop(ex) {
        Exercise.Stop(ex);
        this.requestUpdate('data');
        this.saveSession();
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
        this.modified = true;
        this.saveSession();
    }

    /**
     * @param {ExerciseDistance} ex
     * @param evt
     * @private
     */
    _onChangeDistance(ex, evt) {
        ex.distance = parseFloat(evt.target.value);
        this.modified = true;
        this.saveSession();
    }

    /**
     * @param {ExerciseWeight} ex
     * @param evt
     * @private
     */
    _onChangeWeight(ex, evt) {
        ex.weight = parseInt(evt.target.value);
        this.modified = true;
        this.saveSession();
    }

    /**
     * @param {ExerciseWeight} ex
     * @param evt
     * @private
     */
    _onChangeReps(ex, evt) {
        ex.reps = parseInt(evt.target.value);
        this.modified = true;
        this.saveSession();
    }

    /**
     * @param {ExerciseWeight} ex
     * @param evt
     * @private
     */
    _onChangeSets(ex, evt) {
        ex.sets = parseInt(evt.target.value);
        this.modified = true;
        this.saveSession();
    }

    async _onAdd(ex) {
        console.log('onAdd');
        this.data.exercises.push({...ex});
        this.requestUpdate('data');
        this.modified = true;
        await this.saveSession();
    }


    async _onUpdateRoutine() {
        try {
            const routine = await RoutineRepo.get(this.data.routine);
            routine.exercises = this.data.exercises;
            await RoutineRepo.upsert(routine);
            this.saved = true;
            this.modified = false;
        } catch (e) {
            console.error(e);
            this.error = e.message ?? e
        }
    }

    async _onRemove(ex) {
        this.data.exercises.splice(this.data.exercises.indexOf(ex), 1);
        this.requestUpdate('data');
        this.modified = true;
    }

    async _onFinish(evt) {
        this.data.start ??= this.data.exercises.map(ex => ex.start).sort()[0] ?? Date.now();
        this.data.stop = Date.now();
        await SessionRepo.upsert(this.data);
        this.requestUpdate('data');
    }

    async _onRestart(evt) {
        this.data.stop = Number.MAX_SAFE_INTEGER;
        await SessionRepo.upsert(this.data);
        this.requestUpdate('data');
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.start) {
            return this.lookupRoutine(this.routine).catch(console.error);
        }

        if (this.id !== undefined) {
            return this.lookupSession(this.id).catch(console.error);
        }

        this.data = new Routine();
        this.status = 'new';
    }

    render() {
        if (this.status === 'not found')
            return html`
                <p>not found</p>
                <p><a href="/routines" data-navigo>start a new session from your routines</a></p>`;

        return html`
            <div class="end-controls">
                <h1>Session${!!this.data.id ? html` <span>${this.data.id}</span>` : nothing}</h1>
                <span class="controls">
                    <button @click="${this._onUpdateRoutine}" hidden="${!this.modified || nothing}">Update Routine</button>
                    ${this.saved ? html` ✅` : ''}
                <button class="inline-btn contrast outline" @click="${() => this._onEdit()}" disabled="${Exercise.Stopped(this.data) || nothing}">✏️</button>
                    <p class="error-message">${this.error}</p>
                </span>
            </div>
            <p>${this.renderName()}</p>
            <dl>
                ${repeat(this.data.exercises, (ex, i) => exerciseTemplate(this, ex, i))}
            </dl>
            <div role="group">
                <button class="full-width" @click="${this._onFinish}" disabled="${Exercise.Stopped(this.data) || nothing}">Finish</button>
                <button class="full-width secondary" @click="${this._onRestart}" disabled="${!Exercise.Stopped(this.data) || nothing}">Restart</button>
            </div>
            ${this.editMode ? html`
                <div>
                    <label>Add Exercise
                        <input @input="${this._onChangeSearch}" type="search"/>
                    </label>
                    <ul class="search-results">${repeat(this.searchResults, (ex) => searchResultTemplate(this, ex))}
                    </ul>
                </div>` : ''}
        `;
    }

    renderName() {
        if (this.status === 'found')
            return html`Session ${this.data.id} from <a href="/routine/${this.data.routine}" data-navigo>${this.data.routine}</a>`;
        return html`New session from <a href="/routine/${this.data.routine}" data-navigo>${this.data.routine}</a>`;
    }
}

/**
 *
 * @param {SingleSession} thisArg
 * @param {Exercise} ex
 * @returns {TemplateResult<1>}
 */
function exerciseTemplate(thisArg, ex, i) {
    return html`
        <div class="control-row">
            <dt class="end-controls">
                <span class="title">${ex.name}${Exercise.Stopped(ex) ? ' ✅' : Exercise.Started(ex) ? ' ⬅️' : ''}</span>
                <span class="controls" role="group">
                    ${!thisArg.editMode
                            ? html`
                                <button class="inline-btn secondary"
                                        disabled="${Exercise.Stopped(thisArg.data) || (Exercise.Started(ex) && !Exercise.Stopped(ex)) || nothing}"
                                        @click="${() => thisArg._onStart(ex)}">Start
                                </button>
                                <button class="inline-btn secondary"
                                        disabled="${Exercise.Stopped(thisArg.data) || (Exercise.Stopped(ex) || !Exercise.Started(ex)) || nothing}"
                                        @click="${() => thisArg._onStop(ex)}">Stop
                                </button>`
                            : html`
                                <button class="inline-btn secondary"
                                        disabled="${(Exercise.Started(ex) && !Exercise.Stopped(ex)) || nothing}"
                                        @click="${() => thisArg._onRemove(ex)}">Remove
                                </button>`}
            </span>
            </dt>
            <dd><span>${duration(ex.stop - ex.start)}</span></dd>
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
            return;
        case 'weight':
            return exWeightControls(thisArg, ex, i);
        case 'effort':
            return exEffortControls(thisArg, ex, i);
        case 'distance':
            return exDistanceControls(thisArg, ex, i);
    }
}

function exEffortControls(thisArg, ex, i) {
    return thisArg.editMode
        ? html`<span>
                <label class="fit-size" for="in-eff-${i}">Effort</label>
                <input id="in-eff-${i}" class="fit-size" size="4" value="${ex.effort}"
                       @change="${(evt) => thisArg._onChangeEffort(ex, evt)}" type="number" inputmode="numeric"/>
            </span>`
        : html`<span class="data-display">
                <span>Effort</span>
                <span class="data">${defaultValue(ex.effort, '--')}</span>
            </span>`;
}

function exDistanceControls(thisArg, ex, i) {
    return thisArg.editMode
        ? html`<span>
                <label class="fit-size" for="in-dist-${i}">Distance</label>
                <input id="in-dist-${i}" class="fit-size" size="4" value="${ex.distance}"
                       @change="${(evt) => thisArg._onChangeDistance(ex, evt)}" type="number" inputmode="numeric"/>
            </span>`
        : html`<span class="data-display">
                <span>Distance</span>
                <span class="data">${defaultValue(ex.distance, '--')}</span>
            </span>`;
}

function exWeightControls(thisArg, ex, i) {
    return thisArg.editMode
        ? html`<span>
                <label class="fit-size" for="in-weight-${i}">Weight</label>
                <input id="in-weight-${i}" class="fit-size" size="4" value="${ex.weight}"
                       @change="${(evt) => thisArg._onChangeWeight(ex, evt)}" type="number" inputmode="numeric"/>
            </span>
            <span>
                <label for="in-reps-${i}" class="fit-size">Reps</label>
                <input id="in-reps-${i}" class="fit-size" size="4" value="${ex.reps}"
                       @change="${(evt) => thisArg._onChangeReps(ex, evt)}" type="number" inputmode="numeric"/>
            </span>
            <span>
                <label for="in-sets-${i}" class="fit-size">Sets</label>
                <input id="in-sets-${i}" class="fit-size" size="4" value="${ex.sets}"
                       @change="${(evt) => thisArg._onChangeSets(ex, evt)}" type="number" inputmode="numeric"/>
            </span>`
        : html`<span class="data-display">
                <span>Weight</span>
                <span class="data">${defaultValue(ex.weight, '--')}</span>
            </span>
            <span class="data-display">
                <span>Reps</span>
                <span class="data">${defaultValue(ex.reps, '--')}</span>
            </span>
            <span class="data-display">
                <span>Sets</span>
                <span class="data">${defaultValue(ex.sets, '--')}</span>
            </span>`;
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

window.customElements.define('single-session', SingleSession);
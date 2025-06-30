import {TrakElement} from "./trak-element.js";
import {html, nothing} from "lit";
import ExerciseRepo from '../data/exercise.js'
import {Exercise, ExerciseDistance, ExerciseEffort, ExerciseWeight} from "../models.js";

export class SingleExercise extends TrakElement {
    static get properties() {
        return {
            name: {type: String, reflect: true},
            data: {attribute: false},
            saved: {type: Boolean, attribute: false},
            error: {type: String, attribute: false}
        }
    }

    constructor() {
        super();
        this.data = undefined;
        this.status = false;
        this.saved = false;
        this.error = '';
    }

    async lookup() {
        try {
            this.data = await ExerciseRepo.get(this.name);
        } catch (e) {
            this.data = new Exercise();
        }
    }

    _onNameChange(evt) {
        this.name = evt.target.value;
        this.data.name = this.name;
        this.saved = false;
    }

    _onKindChange(evt) {
        this.data = Object.assign(build(evt.target.value), this.data);
        this.data.kind = evt.target.value;
        this.saved = false;

        function build(kind) {
            switch (kind) {
                default:
                case 'exercise':
                    return new Exercise();
                case 'weight':
                    return new ExerciseWeight();
                case 'distance':
                    return new ExerciseDistance();
                case 'effort':
                    return new ExerciseEffort();
            }
        }
    }

    _onGuideChange(evt){
        this.data.guide = evt.target.value;
        this.saved = false;

        this.requestUpdate('data');
    }

    async _onSave() {
        try {
            await ExerciseRepo.upsert(this.data);
            this.saved = true;
        } catch (e) {
            console.error(e);
            this.error = e.message ?? e
        }
    }


    connectedCallback() {
        super.connectedCallback();
        if (this.name === '') {
            this.data = new Exercise();
            this.isNew = true;
        } else {
            this.lookup().catch(console.error);
        }
    }

    render() {
        const name = this.name ? this.name : 'new exercise';

        const details = this.data !== undefined
            ? html`
                    <dl>
                        ${this.status
                                ? html`
                                    <dt>${this.renderNew()}</dt>`
                                : html`
                                    <dt>${this.data.name}</dt>`}
                        <dd>
                            <label>Kind
                                <select @change="${this._onKindChange}">
                                    <option selected="${this.data.kind === 'exercise' ? '' : nothing}">exercise</option>
                                    <option selected="${this.data.kind === 'weight' ? '' : nothing}">weight</option>
                                    <option selected="${this.data.kind === 'distance' ? '' : nothing}">distance</option>
                                    <option selected="${this.data.kind === 'effort' ? '' : nothing}">effort</option>
                                </select>
                            </label>
                            <p class="detail">${this.explainKind(this.data.kind)}</p>
                        </dd>
                        <dd>
                            <label>Guide Url
                                <input @input="${this._onGuideChange}" value="${this.data.guide}" type="url"/>
                            </label>
                        </dd>
                    </dl>
                    <button @click="${this._onSave}">Save</button>${this.saved ? html` ✅` : ''}
                    <p class="error-message">${this.error}</p>
            `
            : html`<p>not found</p>
                <p><a href="/exercise" data-navigo>add new exercise</a></p>`;
        return html`
            ${details}
        `;
    }

    renderNew() {
        return html`<label>Name<input @input="${this._onNameChange}" placeholder="Name Your New Exercise" type="text"/></label>`;
    }

    explainKind(kind) {
        switch (kind) {
            default:
            case 'exercise':
                return 'A generic exercise. Only your start and stop time can be tracked.'
            case 'weight':
                return 'An exercise with variable weight. You can track the weight, reps, and sets.';
            case 'distance':
                return 'An exercise where you travel some distance.';
            case 'effort':
                return 'An exercise where you track your subjective effort.';
        }
    }
}

window.customElements.define('single-exercise', SingleExercise);
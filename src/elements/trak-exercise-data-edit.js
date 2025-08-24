import {TrakElement} from "./trak-element.js";
import {html} from "lit";

export class TrakExerciseDataEdit extends TrakElement {
    static get properties() {
        return {
            data: {type: Object, attribute: true},
            key: {type: String, attribute: true}
        }
    }

    constructor() {
        super();
    }

    /**
     * @param evt {Event}
     * @private
     */
    _onChangeEffort(evt) {
        this.data.effort = parseFloat(evt.target.value);
    }

    /**
     * @param evt {Event}
     * @private
     */
    _onChangeDistance(evt) {
        this.data.distance = parseFloat(evt.target.value);
    }

    /**
     * @param evt {Event}
     * @private
     */
    _onChangeWeight(evt) {
        this.data.weight = parseInt(evt.target.value);
    }

    /**
     * @param evt {Event}
     * @private
     */
    _onChangeReps(evt) {
        this.data.reps = parseInt(evt.target.value);
    }

    /**
     * @param evt {Event}
     * @private
     */
    _onChangeSets(evt) {
        this.data.sets = parseInt(evt.target.value);
    }

    render() {
        return html`<dt class="end-controls">
            <span class="title">${this.data.name}</span>
            <span class="controls">
                <slot></slot>
            </span>
        </dt>
        <dd class="inline-controls">${this.renderExerciseDetails(this)}</dd>`;
    }

    renderExerciseDetails(self) {
        switch (this.data.kind) {
            default:
            case 'exercise':
                return html`<p>Generic exercise</p>`;
            case 'weight':
                return html`
                        <span>
                            <label class="fit-size" for="in-weight-${this.key}">Weight</label>
                            <input id="in-weight-${this.key}" class="fit-size" size="4" value="${this.data.weight}"
                                   type="number" inputmode="numeric"
                                   @change="${(evt) => this._onChangeWeight(evt)}"/>
                        </span>
                        <span>
                            <label for="in-reps-${this.key}" class="fit-size">Reps</label>
                            <input id="in-reps-${this.key}" class="fit-size" size="4" value="${this.data.reps}"
                                   type="number" inputmode="numeric"
                                   @change="${(evt) => this._onChangeReps(evt)}"/>
                        </span>
                        <span>
                            <label for="in-sets-${this.key}" class="fit-size">Sets</label>
                            <input id="in-sets-${this.key}" class="fit-size" size="4" value="${this.data.sets}"
                                   type="number" inputmode="numeric"
                                   @change="${(evt) => this._onChangeSets(evt)}"/>
                        </span>`;
            case 'effort':
                return html`
                        <span>
                            <label class="fit-size" for="in-eff-${this.key}">Effort</label>
                            <input id="in-eff-${this.key}" class="fit-size" size="4" value="${this.data.effort}"
                                   type="number" inputmode="numeric"
                                   @change="${(evt) => this._onChangeEffort(evt)}"/>
                        </span>`;
            case 'distance':
                return html`
                        <span>
                            <label class="fit-size" for="in-dist-${this.key}">Distance</label>
                            <input id="in-dist-${this.key}" class="fit-size" size="4" value="${this.data.distance}"
                                   type="number" inputmode="numeric"
                                   @change="${(evt) => this._onChangeDistance(evt)}"/>
                        </span>`;
        }
    }
}
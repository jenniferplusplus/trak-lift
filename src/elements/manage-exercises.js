import {TrakElement} from "./trak-element.js";
import {Exercise as  Model} from "../models.js";
import {html} from "lit";
import { repeat } from 'lit/directives/repeat.js';
import {Task} from '@lit/task';
import Exercise from "../data/exercise.js";

export class ManageExercises extends TrakElement {
    static get Properties() {
        return {
            data: {type: Array }
        }
    }

    constructor() {
        super();
    }

    _data = new Task(this, {
        task: async () => this.data = (await Exercise.all()).map(e => e),
    });

    render() {
        this.init();
        return this._data.render({
            pending: () => html`<p>loading...</p>`,
            complete: (data) => html`
            <dl>
                ${repeat(data, (each) => each.name, (each, i) => {
                return html`<div>
                        <dt>${each.name}</dt>
                        <dd>${each.kind}</dd>
                        <dd><a href="${each.guide}">guide</a></dd>
                    </div>`;
            })}
            </dl>
        `
        });
    }
}

window.customElements.define('manage-exercises', ManageExercises);

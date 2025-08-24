import {TrakElement} from "./trak-element.js";
import {html} from "lit";
import {repeat} from "lit/directives/repeat.js";
import {Sortable} from "sortablejs/modular/sortable.core.esm.js";
import {Routine} from "../models.js";

export class TrakExerciseDataList extends  TrakElement {
    static get properties() {
        return {
            data: {type: Array, attribute: true},
            mode: {type: String, attribute: true},
        }
    }

    connectedCallback() {
        super.connectedCallback();
        Sortable.create(this, {
            animation: 150,
            handle: '.drag-handle',
            onStart: (evt) => console.log('onStart', evt),
            onEnd: (evt) => console.log('onEnd', evt),
        });
    }

    /**
     *
     * @param evt {MouseEvent}
     * @private
     */
    _setDraggable(evt) {
        console.log('_setDraggable', evt);
        evt.target.parentElement.draggable = true;
        evt.stopPropagation();
    }

    /**
     *
     * @param evt {MouseEvent}
     * @private
     */
    _unsetDraggable(evt) {
        console.log('_unsetDraggable', evt);
        evt.target.parentElement.draggable = false;
        evt.stopPropagation();
    }

    /**
     * @param evt {DragEvent}
     * @param i {Number}
     * @private
     */
    _onDragStart(evt, i) {
        evt.target.parentElement.classList.add('dragging');
        evt.dataTransfer.setData('text/index', i.toString());
        console.log('_onDragStart', evt);
    }

    /**
     * @param evt {DragEvent}
     * @private
     */
    _onDragOver(evt) {
        evt.preventDefault();
    }

    /**
     * @param evt {DragEvent}
     * @private
     */
    _onDragEnter(evt) {
        console.log('_onDragEnter', evt, evt.target);
        if (evt.target.classList.contains('draggable'))
            evt.target.classList.add('drop-target');
        evt.preventDefault();
    }

    /**
     * @param evt {DragEvent}
     * @private
     */
    _onDragleave(evt) {
        console.log('_onDragleave', evt);
        evt.target.classList.remove('drop-target');
        evt.stopPropagation();
    }

    /**
     * @param evt {DragEvent}
     * @private
     */
    _onDragEnd(evt) {
        evt.target.draggable = false;
        evt.target.parentElement.classList.remove('dragging');
    }

    /**
     * @param evt {DragEvent}
     * @param ex {Exercise}
     * @private
     */
    _onDrop(evt, ex) {
        evt.stopPropagation();

        console.log('_onDrop', evt, ex);
        evt.target.classList.remove('drop-target');
        const source = Number(evt.dataTransfer.getData('text/index'));
        const dest = this.data.indexOf(ex);
        if (source === dest) return;

        this.data = moveIndex(source, dest, this.data);
        const event = new Event('updated', {bubbles: true});
        event.data = this.data;
        this.dispatchEvent(event);
    }

    /**
     * @param evt {Event}
     * @param i {Number}
     * @private
     */
    _pickup(evt, i) {
        evt.target.closest('.draggable').draggable = true;
        evt.preventDefault();
    }

    /**
     *
     * @param evt {TouchEvent}
     * @private
     */
    _putDown(evt) {
        console.log('_putDown', evt, evt.currentTarget);
        const target = evt.currentTarget.clientX
            ? document.elementFromPoint(evt.clientX, evt.clientY)
            : document.elementFromPoint(evt.changedTouches[0].clientX, evt.changedTouches[0].clientY);
        console.log('_putDown', target);
    }

    /**
     * @param evt {Event}
     * @param ex {Exercise}
     * @private
     */
    _onRemove(evt, ex) {
        const event = new Event('updated', {bubbles: true});
        this.data = this.data.toSpliced(this.data.indexOf(ex), 1);
        event.data = ex;
        this.dispatchEvent(event);
    }

    // updated(changedProperties) {
    //     for (const el of this.querySelectorAll('.draggable')) {
    //         console.log(el);
    //         enableDragDropTouch(el, el);
    //     }
    // }

    render() {
        return html`<dl id="data"">
            ${repeat(this.data, (ex, i) => 
                    html`<div class="control-row draggable"
                              @dragenter="${this._onDragEnter}"
                              @dragleave="${this._onDragleave}"
                              @dragstart="${(evt) => this._onDragStart(evt, i)}"
                              @dragover="${this._onDragOver}"
                              @dragend="${this._onDragEnd}"
                              @drop="${(evt) => this._onDrop(evt, ex)}">
                        <span class="drag-handle"
                              @mousedown="${this._setDraggable}"
                              @touchstart="${this._pickup}"
                              @mouseup="${this._unsetDraggable}"
                              @touchend="${this._putDown}">⬍</span>
                        <trak-exercise-data-edit class="fill-row" .key="${i}" .data="${ex}">
                            <button class="inline-btn secondary"
                                    @click="${(evt) => this._onRemove(evt, ex)}">Remove</button>
                        </trak-exercise-data-edit>
                    </div>
                    `)}
        </dl>`
    }
}

function moveIndex(from, to, list) {
    return list.toSpliced(from, 1).toSpliced(to, 0, list[from]);
}
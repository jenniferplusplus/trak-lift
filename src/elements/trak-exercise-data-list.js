import {TrakElement} from "./trak-element.js";
import {html} from "lit";
import {repeat} from "lit/directives/repeat.js";

export class TrakExerciseDataList extends  TrakElement {
    static get properties() {
        return {
            data: {type: Array, attribute: true},
            mode: {type: String, attribute: true},
        }
    }

    /**
     *
     * @param evt {MouseEvent}
     * @private
     */
    _setDraggable(evt) {
        evt.target.parentElement.draggable = true;
        evt.stopPropagation();
    }

    /**
     *
     * @param evt {MouseEvent}
     * @private
     */
    _unsetDraggable(evt) {
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
        if (evt.target.classList.contains('draggable'))
            evt.target.classList.add('drop-target');
        evt.preventDefault();
    }

    /**
     * @param evt {DragEvent}
     * @private
     */
    _onDragleave(evt) {
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
    _pickUp(evt, i) {
        this.shadowRoot.querySelector('.drag-root').classList.add('dragging');
        evt.target.closest('.draggable').draggable = true;
        evt.preventDefault();
    }

    /**
     * @param evt {TouchEvent}
     * @private
     */
    _passOver(evt) {
        if (!this.shadowRoot.querySelector('.drag-root').classList.contains('dragging'))
            return;
        const target = this._getTouchTarget(evt);
        this.shadowRoot.querySelectorAll('.drop-target')
            .forEach(el => {
                if (el !== target) {
                    el.classList.remove('drop-target');
                }
            });
        target?.classList.add('drop-target');
    }

    /**
     * @param evt {TouchEvent}
     * @private
     */
    _putDown(evt) {
        evt.preventDefault();
        const target = this._getTouchTarget(evt);
        const source = this._getTouchSource(evt);
        const dest = this._getTouchDest(target);
        this.shadowRoot.querySelectorAll('.drop-target')
            .forEach(el => {el.classList.remove('drop-target');});
        this.shadowRoot.querySelector('.drag-root').classList.remove('dragging');

        if (source === dest) return;

        this.data = moveIndex(source, dest, this.data);
        const event = new Event('updated', {bubbles: true});
        event.data = this.data;
        this.dispatchEvent(event);
    }

    /**
     * @param evt {TouchEvent}
     * @private
     */
    _putBack(evt) {
        this.shadowRoot.querySelector('.drag-root').classList.remove('dragging');
        this.shadowRoot.querySelectorAll('.drop-target')
            .forEach(el => {el.classList.remove('drop-target');});
    }

    _getTouchTarget(evt) {
        return (evt.currentTarget.clientX
            ? this.shadowRoot.elementFromPoint(evt.clientX, evt.clientY)
            : this.shadowRoot.elementFromPoint(evt.changedTouches[0].clientX, evt.changedTouches[0].clientY))
            .closest('.draggable');
    }

    _getTouchSource(evt) {
        return evt.target.index;
    }

    _getTouchDest(el) {
        return el.index;
    }

    /**
     * @param evt {Event}
     * @param ex {Exercise}
     * @private
     */
    _onRemove(evt, ex) {
        const event = new Event('updated', {bubbles: true});
        this.data = this.data.toSpliced(this.data.indexOf(ex), 1);
        event.data = this.data;
        this.dispatchEvent(event);
    }

    render() {
        return html`<dl id="data" class="drag-root">
            ${repeat(this.data, (ex, i) => 
                    html`<div class="control-row draggable"
                              .index="${i}"
                              @dragenter="${this._onDragEnter}"
                              @dragleave="${this._onDragleave}"
                              @dragstart="${(evt) => this._onDragStart(evt, i)}"
                              @dragover="${this._onDragOver}"
                              @dragend="${this._onDragEnd}"
                              @drop="${(evt) => this._onDrop(evt, ex)}"
                              @touchmove="${this._passOver}">
                        <span class="drag-handle"
                              .index="${i}"
                              @mousedown="${this._setDraggable}"
                              @touchstart="${this._pickUp}"
                              @mouseup="${this._unsetDraggable}"
                              @touchend="${this._putDown}"
                              @touchcancel="${this._putBack}">⬍</span>
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
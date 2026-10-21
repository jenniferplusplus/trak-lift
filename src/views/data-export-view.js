import {TrakElement} from "../elements/trak-element.js";
import {html} from "lit-html";
import Exercise from '../data/exercise.js'
import Routine from '../data/routine.js'
import Session from '../data/session.js'
import {version} from '../data/db.js'
import {nothing} from "lit";

export class DataExport extends TrakElement {
    static get properties() {
        return {
            includeExercises: {type: Boolean},
            includeRoutines: {type: Boolean},
            includeSessions: {type: Boolean},
            importReady: {type: Boolean},
            importFile: {type: Object},
        }
    }

    constructor() {
        super();
        this.includeExercises = true;
        this.includeRoutines = true;
        this.includeSessions = true;
        this.importReady = false;
        this.importFile = null;

        console.log("constructor")
    }

    _onCheck(evt){
        switch (evt.target.id){
            case "chkExercises":
                this.includeExercises = evt.target.checked
                break;
            case "chkRoutines":
                this.includeRoutines = evt.target.checked
                break;
            case "chkSessions":
                this.includeSessions = evt.target.checked
                break;
        }
    }

    async _onExport(evt) {
        const result = {
            version: version,
            exercises: [],
            routines: [],
            sessions: [],
        };
        if (this.includeRoutines) {
            const routines = await Routine.all()
            let next = routines.next()
            while (next){
                result.routines.push(...next)
                next = routines.next()
            }
        }
        if (this.includeSessions) {
            const data = await Session.all()
            let next = data.next()
            while (next){
                result.sessions.push(...next)
                next = data.next()
            }
        }
        if (this.includeExercises) {
            const data = await Exercise.all()
            let next = data.next()
            while (next){
                result.exercises.push(...next)
                next = data.next()
            }
        }

        const blob = new Blob([JSON.stringify(result, undefined, 2)], {type: "text/json"})
        const link = document.createElement("a");

        const date = new Date()
        link.download = `trak-lift-${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.json`;
        link.href = window.URL.createObjectURL(blob);
        link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

        const mouseEvent = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });

        link.dispatchEvent(mouseEvent);
        link.remove()
    }

    _onImportFile(evt) {
        if (evt.target.files.length === 0)
        {
            this.importReady = false;
            return;
        }

        this.importReady = true;
        this.importFile = evt.target.files[0];
    }

    /**
     *
     * @param file
     * @returns {Promise<Object>}
     * @private
     */
    _loadFile(file) {
        const done = Promise.withResolvers()

        const reader = new FileReader();
        let importedData;
        reader.onload = (e) => {
            try {
                importedData = JSON.parse(e.target.result)
                done.resolve(importedData)
            }
            catch (err) {
                done.reject(err)
            }
        }
        reader.readAsText(file)

        return done.promise
    }

    async _onMerge(evt) {
        const data = await this._loadFile(this.importFile)

        for (const each of data.exercises) {
            await Exercise.upsert(each)
        }

        for (const each of data.routines) {
            await Routine.upsert(each)
        }

        for (const each of data.sessions) {
            await Session.upsert(each)
        }

        this.importReady = false;
        this.importFile = null;
    }

    async _onReplace(evt) {
        const data = await this._loadFile(this.importFile)

        if (data.exercises.length > 0) {
            await Exercise.removeAll()
            for (const each of data.exercises) {
                await Exercise.upsert(each)
            }
        }

        if (data.routines.length > 0)
        {
            await Routine.removeAll()
            for (const each of data.routines) {
                await Routine.upsert(each)
            }
        }

        if (data.sessions.length > 0)
        {
            await Session.removeAll()
            for (const each of data.sessions) {
                await Session.upsert(each)
            }
        }

        this.importReady = false;
        this.importFile = null;
    }

    render(){
        return html`<h1>Manage Data</h1>
        <section>
            <h2>Import</h2>
            <input id="fileInput" type="file" @input="${this._onImportFile}">
            <p>Select <code>Merge</code> to update records that match the import.
                Imported records that don't match an existing record will be added.
            </p>
            <p>Select <code>Replace</code> to remove all of your existing records and keep only the imported data.
            </p>
            <span role="group">
                <button disabled="${this.importReady === false || nothing}" @click="${this._onMerge}">Merge</button>
                <button class="secondary" disabled="${this.importReady === false || nothing}" @click="${this._onReplace}">Replace</button>
            </span>
        </section>
        <section>
            <h2>Export</h2>
            <label for="chkExercises">
                <input id="chkExercises" type="checkbox" .checked="${this.includeExercises}" @change="${this._onCheck}">
                Include Exercises
            </label>
            <label for="chkRoutines">
                <input id="chkRoutines" type="checkbox" .checked="${this.includeRoutines}" @change="${this._onCheck}">
                Include Routines
            </label>
            <label for="chkSessions">
                <input id="chkSessions" type="checkbox" .checked="${this.includeSessions}" @change="${this._onCheck}">
                Include Sessions
            </label>
            <span role="group">
                <button id="btnImport" @click="${this._onExport}">Export</button>
            </span>
        </section>
        `
    }
}
import {TrakElement} from "../elements/trak-element.js";
import {html} from "lit-html";
import {base} from '../../trak.config.js';
import {_onNavigate} from "../routes.js";

export class AboutView extends TrakElement {
    render() {
        return html`<h2>Getting Started</h2>
        <p>
            The basic idea is that you would create some routines for yourself, and then start sessions based on those
            routines whenever you do a workout.
        </p>
        <ol>
            <li><a href="/routine" @click="${_onNavigate}" data-navigo>Create a Routine</a>
                <ul>
                    <li>Give it a name (you can't rename routines after they're created)</li>
                    <li>Search for exercises you want</li>
                    <li>Add them to the routine</li>
                    <li>Set the weight, reps, sets, etc</li>
                    <li>You can <a href="/exercise" @click="${_onNavigate}" data-navigo>create new exercises</a> if you need to</li>
                </ul>
            </li>
            <li>Open your <a href="/routines" @click="${_onNavigate}" data-navigo>list of routines</a></li>
            <li>Start one of them</li>
            <li>Update your progress</li>
            <li>Click Finish when you're done</li>
            <li>You can <a href="/sessions" @click="${_onNavigate}" data-navigo>review your recent sessions</a> whenever you want</li>
        </ol>
        <h2>About</h2>
        <p>
            This app exists because I wanted an easy-to-use digital activity tracker.
            There are lots of those, but it's basically impossible to find one that's not stalking you, harvesting every
            last scrap of data it can about you, and selling it to autocrats and billionaires.
            Or they try to hard sell you on slop-filled personal training.
            Most of them do both.
        </p>
        <p>
            So, I built this as a weekend project (it turned into a 3 weekend project, but still). 
            It's an activity tracker. It's a single page app that runs entirely in the browser. 
            It has zero outside services and zero external dependencies.
            It's not trying to track you, and it couldn't even if it did. 
            If you wanted to host it yourself, that's very easy to do. 
            It consists of 1 html file, 1 css file, and 1 js file. 
            Just put them behind any webserver, and you're good to go.
        </p>
        <p>
            This is also an exercise in modern web development.
            It's powered by web components, using <a href="https://lit.dev">Lit</a>.
            Data persistence is provided by IndexedDB, a browser feature that provides structured local data storage.
        </p>
        <h2>Contributing</h2>
        <p>If you'd like to help make this app better, you can 
            <a href="https://github.com/jenniferplusplus/trak-lift">contribute on Github</a>
        </p>
        <a href="https://www.flaticon.com/free-icons/checklist" title="checklist icons">App Icon by Freepik</a>`
    }
}

window.customElements.define('about-view', AboutView);
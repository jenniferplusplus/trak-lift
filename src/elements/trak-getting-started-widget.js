import {TrakElement} from "./trak-element.js";
import {_onNavigate} from "../routes.js";
import {html} from "lit";

export class TrakGettingStartedWidget extends TrakElement {
    render() {
        return html`
            <section>
                <h2>Getting Started</h2>
                <p>To use Trak Lift, you should create some routines for yourself. Then, you can easily start sessions
                    based on those routines with one click. You can modify your sessions on the fly, and you'll have the
                    option to save those changes to the routine for next time.
                </p>
                <ol>
                    <li><a href="/routine" @click="${_onNavigate}" data-navigo>Create a Routine</a>
                        <ul>
                            <li>Give it a name (you can't rename routines after they're created)</li>
                            <li>Search for exercises you want</li>
                            <li>Add them to the routine</li>
                            <li>Set the weight, reps, sets, etc</li>
                            <li>You can <a href="/exercise" @click="${_onNavigate}" data-navigo>create new exercises</a>
                                if you need to
                            </li>
                        </ul>
                    </li>
                    <li>Open your <a href="/routines" @click="${_onNavigate}" data-navigo>list of routines</a></li>
                    <li>Start one of them</li>
                    <li>Update your progress</li>
                    <li>Click Finish when you're done</li>
                    <li>You can <a href="/sessions" @click="${_onNavigate}" data-navigo>review your recent sessions</a>
                        whenever you want
                    </li>
                </ol>
            </section>
        `;
    }
}
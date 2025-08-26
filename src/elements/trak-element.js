import {LitElement} from 'lit'
import {DataEvent} from "../DataEvent.js";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class TrakElement extends LitElement {
    constructor() {
        super()
    }

    static get styles() {
        return getGlobalStyleSheets();
    }

    connectedCallback() {
        super.connectedCallback();
        useGlobalStyles(this.shadowRoot);
    }

    dispatchUpdated(data) {
        const event = new DataEvent(data);
        this.dispatchEvent(event);
    }
}

let globalSheets = null;

function getGlobalStyleSheets() {
    if (globalSheets === null) {
        globalSheets = Array.from(document.styleSheets)
            .map(x => {
                const sheet = new CSSStyleSheet();
                const css = Array.from(x.cssRules).map(rule => rule.cssText).join(' ');
                sheet.replaceSync(css);
                return sheet;
            });
    }

    return globalSheets;
}

function useGlobalStyles(shadowRoot) {
    shadowRoot.adoptedStyleSheets.push(
        ...getGlobalStyleSheets()
    );
}
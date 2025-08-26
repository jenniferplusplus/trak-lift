export class DataEvent extends Event {
    constructor(data) {
        super('updated', {bubbles: true});

        this.data = data;
    }
}
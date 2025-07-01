export class Paged {
    _page = 0;
    _pages = [[]];
    _pageSize;

    static async fromCursor(cursor, pageSize) {
        const pages = new Paged(pageSize);
        for await (const each of cursor) {
            pages.add(each.value);
        }
        return pages;
    }

    static async fromEnumerable(enumerable, pageSize) {
        const pages = new Paged(pageSize);
        for await (const each of enumerable) {
            pages.add(each);
        }
        return pages;
    }

    constructor(pageSize) {
        this._pageSize = pageSize;
    }

    page() {
        return this._page;
    }

    pages() {
        return this._pages.length;
    }

    next(index = null) {
        const p = typeof index === 'number' ? index : this._page++;
        return this._pages[p];
    }

    add(value) {
        let page = this._pages[this._pages.length - 1];
        if (page.length >= this._pageSize) {
            page = [];
            this._pages.push(page);
        }
        page.push(value);
        // this._pages[page] ??= [];
        // this._pages[page].push(value);
    }
}

export class Ranked {
    _rank = 0;
    values = {};
    rankedValues = [];
    rankedKeys = {};

    static async from(iterable) {
        const ranked = new Ranked();
        for await (const each of iterable) {
            ranked.add(each, each.name);
        }
        ranked.finalize();
        return ranked;
    }

    constructor() {
    }

    page() {
        return this._rank;
    }

    pages() {
        return this.rankedValues?.length;
    }

    next(index = null) {
        const p = typeof index === 'number' ? index : this._rank++;
        return this.rankedValues[p];
    }

    add(value, key) {
        this.values[key] = value;
        let rank = this.rankedKeys[key] ?? 0;
        rank++;
        this.rankedKeys[key] = rank;
    }

    finalize() {
        Object.keys(this.rankedKeys).forEach((key) => {
            this.rankedValues[this.rankedKeys[key]] ??= [];
            this.rankedValues[this.rankedKeys[key]].push(this.values[key]);
        });
        this.rankedValues = this.rankedValues.filter(n => n).reverse();
    }
}
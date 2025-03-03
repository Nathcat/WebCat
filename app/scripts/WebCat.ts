const APP_URL = "http://localhost:8080";

export class Page {
    __content: string;
    pageName: string;
    onLoadComplete: () => void = () => {};

    constructor(pageName: string, onLoadComplete: () => void = () => {}) {
        this.__content = "";
        this.pageName = pageName;
        this.onLoadComplete = onLoadComplete;
        
        fetch(APP_URL + "/static/page/" + pageName).then((r) => r.text()).then((r) => {
            this.__content = r;

            $("content").html(this.__content);
            this.onLoadComplete();
        });
    }
};

class App {
    page: Page;

    constructor(rootPageName: string) {
        this.page = new Page(rootPageName);
    }
};
 
export var app = new App("Welcome");
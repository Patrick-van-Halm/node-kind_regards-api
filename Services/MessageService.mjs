export default class MessageService {
    #db;
    constructor(db) {
        this.#db = db;
    }

    get(){
        return [{"id": 1}];
    }
}
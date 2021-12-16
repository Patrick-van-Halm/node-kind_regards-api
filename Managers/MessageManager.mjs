import MessageService from "../Services/MessageService.mjs";

export default class MessageManager {
    #service;
    constructor(db) {
        this.#service = new MessageService(db);
    }

    get(request, response){
        console.log(this.#service.get());
        console.log(request.params.id);
        response.send(true);
    }
}
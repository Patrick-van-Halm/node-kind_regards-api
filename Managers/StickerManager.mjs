export default class StickerManager {
    #services;
    constructor(services) {
        this.#services = services;
    }

    async get(request, response){
        response.status(200);
        response.json(await this.#services.sticker.all());
    }
}
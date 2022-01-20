export default class TextManager {
    #services;
    constructor(services) {
        this.#services = services;
    }

    async all(request, response){
        response.status(200);
        response.json(await this.#services.text.all());
    }

    async allByCategory(request, response){
        let category = await this.#services.category.get(request.params.id);
        if(!category){
            response.status(400);
            response.send("400 Bad Request");
            return;
        }
        
        response.status(200);
        response.json(await this.#services.text.allByCategory(category.id));
    }
}
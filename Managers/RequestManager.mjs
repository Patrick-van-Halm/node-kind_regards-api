export default class RequestManager {
    #services;
    #categoryName = "REQUEST";

    constructor(services) {
        this.#services = services;
    }

    async all(request, response){
        response.status(200);
        response.json(await this.#services.request.all());
    }

    async create(request, response){
        if(!request.headers.authorization){
            response.status(403);
            response.send("403 Forbidden");
            return;
        }

        let user = await this.#services.user.getByAuth(request.headers.authorization.substring(7));
        if(!user){
            response.status(404);
            response.send("404 Not Found");
            return;
        }

        let text = await this.#services.text.get(request.body.text_id);
        if(!text){
            response.status(404);
            response.send("404 Not Found");
            return;
        }

        let textCategory = await this.#services.category.get(text.category_id);
        if(textCategory.name != this.#categoryName){
            response.status(400);
            response.send("400 Bad Request");
            return;
        }

        response.status(201);
        response.json(await this.#services.request.create(user.id, text.id));
    }
}
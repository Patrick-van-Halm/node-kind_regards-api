export default class CategoryManager {
    #services;
    constructor(services) {
        this.#services = services;
    }

    async all(request, response){
        response.status(200);
        response.json(await this.#services.category.all());
    }
}
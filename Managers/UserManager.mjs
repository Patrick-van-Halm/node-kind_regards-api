export default class UserManager {
    #services;
    constructor(services) {
        this.#services = services;
    }

    async getByAuth(request, response){
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
        
        response.status(200);
        response.json(user);
    }

    async create(request, response){
        if(!request.body.device_id){
            response.status(400);
            response.send("400 Bad Request");
            return;
        }

        let user = await this.#services.user.getByAuth(request.body.device_id);
        if(user){
            response.status(400);
            response.send("400 Bad Request");
            return;
        }

        response.status(201);
        response.json(await this.#services.user.create(request.body.device_id));
    }
}
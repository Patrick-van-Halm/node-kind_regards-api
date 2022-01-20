export default class MessageManager {
    #services;
    #categoryName = "RESPONSE";
    constructor(services) {
        this.#services = services;
    }

    async create(request, response){
        if(!request.body.text_id){
            response.status(400);
            response.send("400 Bad Request");
            return;
        };

        let sender = await this.#services.user.getByAuth(request.headers.authorization.substring(7));
        if(!sender){
            response.status(404);
            response.send("404 Not Found");
            return;
        }

        let req = await this.#services.request.get(request.params.id);
        if(!req){
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

        let category = await this.#services.category.get(text.category_id);
        if(category.name != this.#categoryName){
            response.status(400);
            response.send("400 Bad Request");
            return;
        }

        let gift = {"id": null};
        if(request.body.sticker_id && request.body.customization){
            let sticker = await this.#services.sticker.get(request.body.sticker_id);
            if(!sticker){
                response.status(404);
                response.send("404 Not Found");
                return;
            }

            gift = await this.#services.gift.create(sticker.id, request.body.customization);
        }

        let msg = await this.#services.message.create(sender.id, req.id, text.id, gift.id);
        if(!msg){
            response.status(400);
            response.send("400 Bad Request");
            return;
        }

        response.status(201);
        response.json(msg);
    }

    async get(request, response){
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

        let messages = await this.#services.message.getFromUser(user.id);
        for(let i in messages){
            if(messages[i].gift_id) messages[i].gift = await this.#services.gift.get(messages[i].gift_id);
        }

        response.status(200);
        response.json(messages);
    }

    async getSentMessages(request, response){
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

        let sentMessages = await this.#services.message.getByUser(user.id);
        for(let i in sentMessages){
            if(sentMessages[i].gift_id) sentMessages[i].gift = await this.#services.gift.get(sentMessages[i].gift_id);
            if(sentMessages[i].thanks_id) sentMessages[i].thanks = await this.#services.thanks.get(sentMessages[i].thanks_id);
        }
        response.status(200);
        response.json(sentMessages);
    }

    async sendThanks(request, response){
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

        let message = await this.#services.message.get(request.params.id);
        if(!message){
            response.status(404);
            response.send("404 Not Found");
            return;
        }

        let req = await this.#services.request.get(message.request_id);
        if(req.requester_id != user.id){
            response.status(401);
            response.send("401 Unauthorized");
            return;
        }

        if(message.thanks_id){
            response.status(400);
            response.send("400 Bad Request");
            return;
        }

        let thanks = await this.#services.thanks.create();
        message = await this.#services.message.setThanks(message.id, thanks.id);
        if(message.gift_id) message.gift = await this.#services.gift.get(message.gift_id);
        message.thanks = thanks;

        response.status(200);
        response.json(message);
    }

    async markSeen(request, response){
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

        let message = await this.#services.message.get(request.params.id);
        if(!message){
            response.status(404);
            response.send("404 Not Found");
            return;
        }

        if(message.opened_at){
            response.status(400);
            response.send("400 Bad Request");
            return;
        }

        let req = await this.#services.request.get(message.request_id);
        if(req.requester_id != user.id){
            response.status(401);
            response.send("401 Unauthorized");
            return;
        }

        message = await this.#services.message.markSeen(message.id);
        if(message.gift_id) message.gift = await this.#services.gift.get(message.gift_id);
        response.status(200);
        response.json(message);
    }

    async markThanksSeen(request, response){
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

        let thanks = await this.#services.thanks.get(request.params.id);
        if(!thanks){
            response.status(404);
            response.send("404 Not Found");
            return;
        }

        if(thanks.opened_at){
            response.status(400);
            response.send("400 Bad Request");
            return;
        }

        let message = await this.#services.message.get(request.body.message_id);
        if(message.sender_id != user.id){
            response.status(401);
            response.send("401 Unauthorized");
            return;
        }

        thanks = await this.#services.thanks.markSeen(thanks.id);
        response.status(200);
        response.json(thanks);
    }
}
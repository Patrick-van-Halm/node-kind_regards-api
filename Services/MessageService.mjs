export default class MessageService {
    #db;
    constructor(db) {
        this.#db = db;

        this.#db.query(`
            CREATE TABLE IF NOT EXISTS messages
            (
                id serial PRIMARY KEY,
                request_id int NOT NULL REFERENCES public.requests (id) ON DELETE CASCADE,
                sender_id int NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
                text_id int NOT NULL REFERENCES public.texts (id) ON DELETE CASCADE,
                gift_id int REFERENCES public.gifts (id) ON DELETE SET NULL,
                thanks_id int REFERENCES public.thanks (id) ON DELETE SET NULL,
                opened_at timestamp,
                received_at timestamp NOT NULL DEFAULT NOW()                
            );
        `)
    }

    async create(senderId, requestId, textId, giftId){
        let res = await this.#db.query("INSERT INTO public.messages (request_id, sender_id, text_id, gift_id) VALUES ($1, $2, $3, $4) RETURNING *", [requestId, senderId, textId, giftId]);
        return res.rows[0];
    }

    async setThanks(id, thanksId){
        let res = await this.#db.query("UPDATE public.messages SET thanks_id = $2 WHERE id = $1 RETURNING *", [id, thanksId]);
        return res.rows[0];
    }

    async markSeen(id){
        let res = await this.#db.query("UPDATE public.messages SET opened_at = NOW() WHERE id = $1 RETURNING *", [id]);
        return res.rows[0];
    }

    async get(id){
        let res = await this.#db.query("SELECT * FROM public.messages WHERE id = $1", [id]);
        return res.rows[0];
    }

    async getFromUser(user_id){
        let res = await this.#db.query("SELECT msg.* FROM public.messages msg, public.requests req WHERE msg.request_id = req.id AND req.requester_id = $1", [user_id]);
        return res.rows;
    }

    async getByUser(user_id){
        let res = await this.#db.query("SELECT * FROM public.messages WHERE sender_id = $1", [user_id]);
        return res.rows;
    }
}
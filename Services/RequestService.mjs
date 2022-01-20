export default class RequestService {
    #db;
    constructor(db) {
        this.#db = db;

        this.#db.query(`
            CREATE TABLE IF NOT EXISTS requests
            (
                id serial PRIMARY KEY,
                requester_id int NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
                text_id int NOT NULL REFERENCES public.texts (id) ON DELETE CASCADE
            );
        `)
    }

    async all(){
        let res = await this.#db.query("SELECT * FROM public.requests");
        return res.rows;
    }

    async create(userId, textId){
        let res = await this.#db.query("INSERT INTO public.requests (requester_id, text_id) VALUES ($1, $2) RETURNING *", [userId, textId]);
        return res.rows[0];
    }

    async get(id){
        let res = await this.#db.query("SELECT * FROM public.requests WHERE id = $1", [id]);
        return res.rows[0];
    }
}
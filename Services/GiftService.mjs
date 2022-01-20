export default class UserService {
    #db;
    constructor(db) {
        this.#db = db;

        this.#db.query(`
            CREATE TABLE IF NOT EXISTS gifts
            (
                id serial PRIMARY KEY,
                sticker_id int NOT NULL REFERENCES public.stickers (id) ON DELETE CASCADE,             
                customization json NOT NULL
            );
        `)
    }

    async create(stickerId, customization){
        let res = await this.#db.query("INSERT INTO public.gifts (sticker_id, customization) VALUES ($1, $2) RETURNING *", [stickerId, customization]);
        return res.rows[0];
    }

    async get(id){
        let res = await this.#db.query("SELECT * FROM public.gifts WHERE id = $1", [id]);
        return res.rows[0];
    }
}
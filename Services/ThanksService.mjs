export default class ThanksService {
    #db;
    constructor(db) {
        this.#db = db;

        this.#db.query(`
            CREATE TABLE IF NOT EXISTS thanks
            (
                id serial PRIMARY KEY, 
                opened_at timestamp,
                received_at timestamp NOT NULL DEFAULT NOW()
            );
        `)
    }

    async get(id){
        let res = await this.#db.query("SELECT * FROM public.thanks WHERE id = $1", [id]);
        return res.rows[0];
    }

    async create(){
        let res = await this.#db.query("INSERT INTO public.thanks DEFAULT VALUES RETURNING *");
        return res.rows[0];
    }

    async markSeen(id){
        let res = await this.#db.query("UPDATE public.thanks SET opened_at = NOW() WHERE id = $1 RETURNING *", [id]);
        return res.rows[0];
    }
}
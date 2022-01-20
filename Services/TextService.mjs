export default class TextService {
    #db;
    constructor(db) {
        this.#db = db;

        this.#db.query(`
            CREATE TABLE IF NOT EXISTS texts
            (
                id serial PRIMARY KEY,
                category_id int NOT NULL REFERENCES public.text_category (id) ON DELETE CASCADE,
                "text" text NOT NULL UNIQUE
            );
            
            INSERT INTO texts (category_id, text) VALUES (1, 'Hi, I feel down can you guys pep me up?') ON CONFLICT (text) DO NOTHING;
            INSERT INTO texts (category_id, text) VALUES (2, 'Hey, I feel for you and I''m here for you.') ON CONFLICT (text) DO NOTHING;
        `)
    }

    async get(id){
        let res = await this.#db.query("SELECT * FROM public.texts WHERE id = $1", [id]);
        return res.rows[0];
    }

    async allByCategory(category_id){
        let res = await this.#db.query("SELECT * FROM public.texts WHERE category_id = $1", [category_id]);
        return res.rows;
    }

    async all(){
        let res = await this.#db.query("SELECT * FROM public.texts");
        return res.rows;
    }
}
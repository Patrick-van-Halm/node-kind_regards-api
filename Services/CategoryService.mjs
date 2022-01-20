export default class CategoryService {
    #db;
    constructor(db) {
        this.#db = db;

        this.#db.query(`
            CREATE TABLE IF NOT EXISTS text_category
            (
                id serial PRIMARY KEY,
                "name" varchar(255) NOT NULL UNIQUE
            );
            
            INSERT INTO text_category (name) VALUES ('REQUEST') ON CONFLICT (name) DO NOTHING;
            INSERT INTO text_category (name) VALUES ('RESPONSE') ON CONFLICT (name) DO NOTHING;
        `)
    }

    async all(){
        let res = await this.#db.query("SELECT * FROM public.text_category");
        return res.rows;
    }

    async get(id){
        let res = await this.#db.query("SELECT * FROM public.text_category WHERE id = $1", [id]);
        return res.rows[0];
    }
}
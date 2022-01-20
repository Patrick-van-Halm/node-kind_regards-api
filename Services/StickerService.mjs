export default class StickerService {
    #db;
    constructor(db) {
        this.#db = db;

        this.#db.query(`
            CREATE TABLE IF NOT EXISTS stickers
            (
                id serial PRIMARY KEY,
                prefab_path varchar(500) NOT NULL UNIQUE
            );
        `)
    }

    async all(){
        let res = await this.#db.query("SELECT * FROM public.stickers");
        return res.rows;
    }

    async get(id){
        let res = await this.#db.query("SELECT * FROM public.stickers WHERE id = $1", [id]);
        return res.rows[0];
    }
}
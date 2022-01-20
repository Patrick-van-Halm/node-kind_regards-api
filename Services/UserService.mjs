export default class UserService {
    #db;
    constructor(db) {
        this.#db = db;

        this.#db.query(`
            CREATE TABLE IF NOT EXISTS users
            (
                id serial PRIMARY KEY,
                device_id char(255) NOT NULL UNIQUE
            );
        `)
    }

    async create(deviceId){
        let res = await this.#db.query("INSERT INTO public.users (device_id) VALUES ($1) RETURNING *", [deviceId]);
        return res.rows[0];
    }

    async get(id){
        let res = await this.#db.query("SELECT * FROM public.users WHERE id = $1", [id]);
        return res.rows[0];
    }

    async getByAuth(deviceId){
        let res = await this.#db.query("SELECT * FROM public.users WHERE device_id = $1", [deviceId]);
        return res.rows[0];
    }
}
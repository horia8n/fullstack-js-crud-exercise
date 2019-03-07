const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(cors());

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};

const table = 'employees';
const {Pool} = require('pg');
const pgClient = new Pool({
    host: 'localhost',
    port: '5432',
    database: 'plexxis',
    user: 'xxxxxxxx',
    password: 'xxxxxxxxxxxxxx'
});
pgClient.on('error', () => console.log('Lost PG connection'));

class postgres_pg_Model {
    static async getAll() {
        return await pgClient.query(`SELECT * FROM ${table} ORDER BY id`)
            .then(result => result.rows)
            .catch(err => err);
    }

    static async getOne(id) {
        return await pgClient.query(`SELECT * FROM ${table} WHERE id = ${id}`)
            .then(result => result.rows[0])
            .catch(err => err);
    }

    static async insert(row) {
        const rowNamesArr = [];
        const rowValuesArr = [];
        Object.keys(row).forEach((element) => {
            if (element !== 'id') {
                rowNamesArr.push(element);
                rowValuesArr.push(row[element]);
            }
        });
        const rowNames = rowNamesArr.join(", ");
        const rowValues = "'" + rowValuesArr.join("', '") + "'";
        let query = `INSERT INTO ${table} (${rowNames}) VALUES (${rowValues})`;
        query = query.replace(/'null'/g, 'null');
        query = query.replace(/'true'/g, 'true');
        query = query.replace(/'false'/g, 'false');
        await pgClient.query(query)
            .catch(err => err);
        return await this.getAll();
    }

    static async update(id, row) {
        const rowArr = [];
        Object.keys(row).forEach((element) => {
            if (element !== 'id') {
                rowArr.push(`${element} = '${row[element]}'`);
            }
        });
        let query = `UPDATE ${table} SET ${rowArr.join(", ")} WHERE id = ${id}`;
        query = query.replace(/'null'/g, 'null');
        query = query.replace(/'true'/g, 'true');
        query = query.replace(/'false'/g, 'false');
        await pgClient.query(query)
            .catch(err => err);
        return await this.getAll();
    }

    static async remove(id) {
        await pgClient.query(`DELETE FROM ${table} WHERE id = ${id}`)
            .catch(err => err);
        return await this.getAll();
    }
}

//------------------------------- routes
app.get('/api/employees', async (req, res) => {
    console.log('GET /api/employees/');
    res.send(await postgres_pg_Model.getAll());
});
app.get('/api/employees/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`GET /api/employees/${id}`);
    res.send(await postgres_pg_Model.getOne(id));
});
app.post('/api/employees/insert', async (req, res) => {
    console.log('POST /api/employees/insert');
    const row = req.body;
    res.send(await postgres_pg_Model.insert(row));
});
app.put('/api/employees/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`PUT /api/employees/${id}`);
    const row = req.body;
    res.send(await postgres_pg_Model.update(id, row));
});
app.delete('/api/employees/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`DELETE /api/employees/${id}`);
    res.send(await postgres_pg_Model.remove(id));
});


app.listen(8080, () => console.log('Job Dispatch API running on port 8080!'))
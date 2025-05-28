import express from 'express';
import pg from 'pg';
import cors from 'cors';

const app = express();
app.use(express.json()); 

app.use(cors());

const port = 3008;

const db = new pg.Client({
    host: 'localhost',
    user: 'postgres',
    database: 'Inventory',
    password: 'postgresql',
    port: '5432'
});

db.connect();

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    try {
        const result = await db.query('SELECT * FROM login_page WHERE email_id = $1 AND password = $2', [username, password]);

        if (result.rows.length > 0) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/productList1/:id', function (req, res) {
    let id = req.params.id;
    let sql = "SELECT *  FROM product_list WHERE product_id=$1";
    db.query(sql, [id], function (err, results) {
        if (err) throw err;
        res.send(results.rows);
    });
});

app.get('/inwardList1/:id', function (req, res) {
    let id = req.params.id;
    let sql = "SELECT *  FROM inward_details WHERE id=$1";
    db.query(sql, [id], function (err, results) {
        if (err) throw err;
        res.send(results.rows);
    });
});
app.get('/totalProductSum', function (req, res) {
    let sql = "SELECT SUM(stocks) as Total FROM product_list";
    db.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results.rows);
    });
});

app.get('/productList', function (req, res) {
    let sql = "SELECT *  FROM product_list";
    db.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results.rows);
    });
});

app.get('/inwardSum', function (req, res) {
    let sql = "SELECT SUM(num_product) as Total, SUM(Price) as price FROM inward_details";
    db.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results.rows);
    });
});

app.get('/outwardSum', function (req, res) {
    let sql = "SELECT SUM(num_product) as Total, SUM(Price) as price FROM outward_details";
    db.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results.rows);
    });
});

app.get('/outwardDate', function (req, res) {
    let sql = "SELECT Date FROM outward_details";
    db.query(sql, function (err, results) {
        if (err) throw err;

        res.send(results.rows);
    });
});

app.get('/outwardDate1/:date', function (req, res) {
    let date = req.params.date;
    let sql = 'SELECT SUM(num_product) FROM outward_details where EXTRACT(MONTH FROM "date"::date)=$1';
    db.query(sql, [date], function (err, results) {
        if (err) throw err;
        res.send(results.rows);
    });
});

app.get('/productList', function (req, res) {
    let sql = "SELECT * FROM product_list";
    db.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results.rows);
    });
});

app.get('/inward', function (req, res) {
    let sql = "SELECT * FROM inward_details";
    db.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results.rows);
    });
});

app.post('/productListUp', function (req, res) {
    let sql = "INSERT INTO product_list(product_name, product_price, stocks) VALUES ($1, $2, $3)";
    let data = [
        req.body.productName,
        req.body.productPrice,
        req.body.stocks
    ];
    db.query(sql, data, function (err, results) {
        if (err) throw err;
        res.json(results);
    });
}); 

app.post('/inwardListUp', function (req, res) {
    let sql = "INSERT INTO inward_details(product_id, date, product_name, price, num_product) VALUES ($1, $2, $3,$4,$5)";
    let data = [
        req.body.product_id,
        req.body.date,
        req.body.productName,
        req.body.productPrice,
        req.body.numProduct
    ];
    db.query(sql, data, function (err, results) {
        if (err) throw err;
        res.json(results);
    });
});

app.put('/listupdate/:id', (req, res) => {
    const sql = 'UPDATE product_list SET product_name=$1, product_price=$2, stocks=$3 WHERE product_id=$4';
    const id = req.params.id;
    const values = [
        req.body.productName,
        req.body.price,
        req.body.stock,
        id
    ];
    db.query(sql, values, (err, result) => {
        if (err) return console.log(err);
        return res.json(result);
    });
});

app.put('/inwardlist/:id', (req, res) => {
    const sql = 'UPDATE inward_details SET product_id=$1, date=$2, product_name=$3, price=$4, num_product=$5 WHERE id=$6';
    const id = req.params.id;
    const values = [
        req.body.product_id,
        req.body.date,
        req.body.productName,
        req.body.productPrice,
        req.body.numProduct,
        id
    ];
    db.query(sql, values, (err, result) => {
        if (err) return console.log(err);
        return res.json(result);
    });
});

app.delete('/inwarddelete/:id', (req, res) => {
    const sql = "DELETE FROM inward_details WHERE id=$1";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) return console.log(err);
        return res.json(result);
    })
})

// outward 

app.get('/outwardList1/:id', function (req, res) {
    let id = req.params.id;
    let sql = "SELECT *  FROM outward_details WHERE id=$1";
    db.query(sql, [id], function (err, results) {
        if (err) throw err;
        res.send(results.rows);
    });
});

app.get('/outward', function (req, res) {
    let sql = "SELECT * FROM outward_details";
    db.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results.rows);
    });
});

app.post('/outwardListUp', function (req, res) {
    let sql = "INSERT INTO outward_details(product_id, date, product_name, price, num_product) VALUES ($1, $2, $3,$4,$5)";
    let data = [
        req.body.product_id,
        req.body.date,
        req.body.productName,
        req.body.productPrice,
        req.body.numProduct
    ];    
    db.query(sql, data, function (err, results) {
        if (err) throw err;
        res.json(results);
    });
});

app.put('/outwardlist/:id', (req, res) => {
    const sql = 'UPDATE outward_details SET product_id=$1, date=$2, product_name=$3, price=$4, num_product=$5 WHERE id=$6';
    const id = req.params.id;
    const values = [
        req.body.product_id,
        req.body.date,
        req.body.productName,
        req.body.productPrice,
        req.body.numProduct,
        id
    ]; 
    db.query(sql, values, (err, result) => {
        if (err) return console.log(err);
        return res.json(result);
    });
});

app.delete('/outwarddelete/:id', (req, res) => {
    const sql = "DELETE FROM outward_details WHERE id=$1";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) return console.log(err);
        return res.json(result);
    })
})

// inward data added then  list data chenges 

app.put('/inward_listUpdate/:id', (req, res) => {
    let sql = 'UPDATE product_list SET stocks = stocks + $1 WHERE product_id = $2';
    let data = [parseInt(req.body.numProduct), req.params.id];
    db.query(sql, data, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});

// inward data sorting 

const buildDateRangeQuery = (startDate, endDate) =>
    startDate && endDate ? `date BETWEEN '${startDate}' AND '${endDate}'` : '';

const buildDateRangeProductQuery = (startDate, endDate, productName) =>{
const lowercaseProductName = productName ? productName.toLowerCase() : '';
   return startDate && endDate && lowercaseProductName
        ? `date BETWEEN '${startDate}' AND '${endDate}' AND LOWER(product_name) = '${lowercaseProductName}'`
        : '';
}

const buildProductQuery = (productName) => {
    const lowercaseProductName = productName ? productName.toLowerCase() : '';
    return lowercaseProductName ? `LOWER(product_name) = '${lowercaseProductName}'` : '';
};


const buildDateAndProductQuery = (startDate, endDate, productName) =>
    [buildDateRangeQuery(startDate, endDate), buildProductQuery(productName), buildDateRangeProductQuery(startDate, endDate, productName)]
        .filter(Boolean)
        .join(' AND ');

app.get('/inwardSorting', (req, res) => {
    try {
        const { startDate, endDate, productName } = req.query;

        const conditions = buildDateAndProductQuery(startDate, endDate, productName);

        const query = `SELECT * FROM inward_details WHERE ${conditions}`;

        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.send(result.rows);
            }
        });
    } catch (err) {
        res.send({ error: 'There is an error' });
    }
});

app.get('/outwardSorting', (req, res) => {
    try {
        const { startDate, endDate, productName } = req.query;

        const conditions = buildDateAndProductQuery(startDate, endDate, productName);

        const query = `SELECT * FROM outward_details WHERE ${conditions}`;

        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.send(result.rows);
            }
        });
    } catch (err) {
        res.send({ error: 'There is an error' });
    }
});







//outward datas decreasing in list

app.put('/outward_listUpdate/:id', (req, res) => {
    let sql = 'UPDATE product_list SET stocks = stocks - $1 WHERE product_id = $2';
    let data = [parseInt(req.body.numProduct), req.params.id];
    // console.log(req.body.numProduct);
    db.query(sql, data, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});

app.listen(port, (err, res) => {
    console.log(`port running ${port}`);
})
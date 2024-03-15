const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const db = require("./config/db");
const listCategory = require("./model/listCategory");
const listProduct = require("./model/listProduct");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.static('public'));

app.set("view engine", "ejs");

app.get('/', async (req, res) => {
    try {
        res.render("frontend/index");

        await listCategory.defineInitialCategories();
        await listProduct.defineInitialProducts();
        //res.status(500).send("Internal Server Error");
        //res.sendFile(path.join(__dirname, 'public', 'inventory.html'));
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/product', async (req, res) => {
    const items = await listProduct.findAll();

      // Render the view with the provided data
      res.render("frontend/product", {
          newListItems: items,
      });
})

app.get('/product/tops', async (req, res) => {
    const items = await listProduct.findAllByKey('category_id', 1);

    res.render("frontend/product", {
        newListItems: items,
    });
})

app.get('/product/bottoms', async (req, res) => {
    const items = await listProduct.findAllByKey('category_id', 2);
    
    res.render("frontend/product", {
        newListItems: items,
    });
})


app.get('/product/shoes', async (req, res) => {
    const items = await listProduct.findAllByKey('category_id', 3);
    
    res.render("frontend/product", {
        newListItems: items,
    });
})

app.get('/shoppingcart', (req, res) => {
    res.render("frontend/shoppingcart");
})

app.get('/wishlist', (req, res) => {
    res.render("frontend/wishlist");
})

app.get('/cart', (req, res) => {
    res.render("frontend/shoppingcart");
})

app.get('/admin', (req, res) => {
    res.render("backoffice/inventory");
})

app.get('/admin/order', (req, res) => {
    res.render("backoffice/order");
})

app.get('/admin/login', (req, res) => {
    res.render("backoffice/adminlogin");
})

// app.post('/books/add', (req, res) => {
//     const { bookName } = req.body; 
//     const sql = 'INSERT INTO books (BookName) VALUES (?)'; 

//     db.execute(sql, [bookName], (error, results) => { 
//         if (error) {
//             console.error('Error inserting into the database: ', error);
//             return res.status(500).send('Internal Server Error');
//         }
//         console.log('Inserted book into database:', results);
//         res.redirect('/'); 
//     });
// });


// app.get('/books', (req, res) => {
//     const sql = 'SELECT * FROM books'; 

//     db.query(sql, (err, rows) => {
//         if (err) {
//             console.error('Error fetching books from the database: ', err);
//             return res.status(500).send('Internal Server Error');
//         }
//         console.log('Retrieved books from database:', rows);
//         res.json(rows); 
//     });
// });

app.listen(3500, () => {
    console.log('Server is running on port 3500');
});

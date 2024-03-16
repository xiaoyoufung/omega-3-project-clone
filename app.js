const express = require('express');
const bodyParser = require('body-parser');
const listCategory = require('./model/listCategory');
const listProduct = require('./model/listProduct');
const listUser = require('./model/listUser');

// login-register sesstion
const session = require('express-session');
const { forEach, forIn } = require('lodash');
const store = new session.MemoryStore();

const app = express();

// define session
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 1000 },
    saveUninitialized: false,
    store
}));


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(express.static('public'));

app.set("view engine", "ejs");

app.get('/', async (req, res) => {
    try {

        res.render("frontend/index");

        // Initial default data to the DB
        await listCategory.defineInitialCategories();
        await listProduct.defineInitialProducts();
        await listUser.defineInitialUsers();

        //res.status(500).send("Internal Server Error");
        //res.sendFile(path.join(__dirname, 'public', 'inventory.html'));
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/login', async (req, res) => {
    const items = await listProduct.findAll();

      // Render the view with the provided data
      res.render("frontend/login", {
          newListItems: items,
      });
});

app.post('/auth', async (req, res) => {
    const {username, password} = req.body;

    const oldUserName = await listUser.findAllByKey('user_name', username);
    const oldPwd = await listUser.findAllByKey('user_password', password);

    try {
        if(username && password){
            if(req.session.authenticated){
                res.json(req.sessionID);
            } else{
                if(username == oldUserName[0].user_name && password == oldPwd[0].user_password){
                    req.session.authenticated = true;
                    req.session.user = {
                        username, password
                    };
                    res.json(req.sessionID);
                } else{
                    res.redirect('/login');
                }
            }
        }
    } catch (error) {
        res.redirect('/login');
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

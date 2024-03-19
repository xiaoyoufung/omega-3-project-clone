const express = require('express');
const bodyParser = require('body-parser');
const listCategory = require('./model/listCategory');
const listProduct = require('./model/listProduct');
const listUser = require('./model/listUser');

// login-register sesstion
const session = require('express-session');
const Authen = require("./control/user-authen");
const store = new session.MemoryStore();

const app = express();

// define session
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 3600000 },
    saveUninitialized: false,
    store
}));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

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

// log-in authentication for user & admin
app.post('/auth', async (req, res) => {
    const { username, password } = req.body;
    const oldUserName = await listUser.findAllByKey('user_name', username);
    const oldPwd = await listUser.findAllByKey('user_password', password);
    const isAdmin = await oldUserName[0].isAdmin;

    try {
        if (username && password) {
            if (req.session.authenticated) {
                res.redirect('/');
            } else {
                if (username == oldUserName[0].user_name && password == oldPwd[0].user_password) {
                    req.session.authenticated = true;
                    req.session.user = {
                        username, password
                    };
                    // check if user isAdmin
                    if (isAdmin == 0) {
                        req.session.isAdmin = false;
                        res.redirect('/');
                    } else {
                        req.session.isAdmin = true;
                        res.redirect('/admin');
                    }

                } else {
                    res.redirect('/login');
                }
            }
        } else {
            throw err;
        }
    } catch (error) {
        res.redirect('/login');
    }

});



// user logout
app.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
})


app.get('/product', async (req, res) => {
    const items = await listProduct.findAll();

    // Render the view with the provided data
    res.render("frontend/product", {
        newListItems: items,
        navSelect: 0 + 5,
    });
})

app.get("/product/:category", async (req, res) => {
    // get category's name from path
    let category = (req.params.category);
   

    // use category's name to find category's id
    const categoryName = await listCategory.findAllByKey('name', category);
    const categoryId = categoryName[0].category_id;
    
    // find product by category's id
    const items = await listProduct.findAllByKey('category_id', categoryId);
    
    res.render("frontend/product", {
        newListItems: items,
        navSelect: parseInt(categoryId) + 5,
    });

  });


// user must login to access to these page
app.get('/wishlist', (req, res) => {
    res.render("frontend/wishlist");
})

app.get('/cart', Authen.userAuthentication, (req, res) => {
    res.render("frontend/shoppingcart");
})

// example
app.get("/more", Authen.userAuthentication, function (req, res) {
    res.render("more", { pageName: "Account" });
});


app.get('/admin', (req, res) => {
    res.redirect('/admin/inventory');
})

// backoffice side
app.get('/admin/inventory', Authen.adminAuthentication, async (req, res) => {
    const items = await listProduct.findAll();
    res.render("backoffice/inventory", {
        pageName: "inventory",
        products: items,
        secondTabSelect: 2,
    });
});

app.get('/admin/inventory/:category', Authen.adminAuthentication, async (req, res) => {

    let category = (req.params.category);

    // use category's name to find category's id
    const categoryName = await listCategory.findAllByKey('name', category);
    const categoryId = categoryName[0].category_id;
    
    // find product by category's id
    const items = await listProduct.findAllByKey('category_id', categoryId);

    res.render("backoffice/inventory_sort",
        {
            pageName: "inventory",
            products: items,
            secondTabSelect: (parseInt(categoryId) + 2),
        });
});

app.get('/admin/sales', Authen.adminAuthentication, (req, res) => {
    res.render("backoffice/sales", { pageName: "sales" });
});

app.get('/admin/delete-product/:id', (req, res) => {
    let productID = parseInt(req.params.id);

    listProduct.deleteByKey('product_id', productID);

    res.redirect('/admin');
});

app.post('/add-item', (req, res) => {
    listProduct.addNewProduct();
    res.redirect('/admin');
});

app.post('/admin/inventory/:category', (req, res) => {

    res.redirect('admin');
})

app.post('/admin/inventory', (req, res) => {

    // get changed value
    prodID = req.body.productID;
    prodName = req.body.productName;
    prodImg = req.body.productImg;
    prodCategory = req.body.productCategory;
    prodPrice = req.body.productPrice;
    prodProPrice = req.body.productPromotionPrice;
    prodTag = req.body.productTag;
    prodSale = req.body.productSaleCount;

    const updateProduct = {
        product_name: prodName,
        category_id: prodCategory,
        product_image: prodImg,
        product_price: prodPrice,
        product_price_promotion: prodProPrice,
        product_tag: prodTag
    }

    listProduct.updateProduct(prodID, updateProduct)

    res.redirect('/admin');
});

app.listen(3500, () => {
    console.log('Server is running on port 3500');
});

const express = require('express');
const bodyParser = require('body-parser');
const listCategory = require('./model/listCategory');
const listProduct = require('./model/listProduct');
const listUser = require('./model/listUser');
const listBill = require('./model/listBill');
const moment = require("moment");
 
// 24 Hour format
console.log(
    moment()
        .format("YYYY/MM/DD HH:mm:ss")
);

// login-register sesstion
const session = require('express-session');
const Authen = require("./control/user-authen");
const store = new session.MemoryStore();
const Cart = require('./model/cart');

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
        const items = await listProduct.findAll();
        res.render("frontend/index", {products: items});

        // Initial default data to the DB
        await listCategory.defineInitialCategories();
        await listProduct.defineInitialProducts();
        await listUser.defineInitialUsers();
        await listBill.defineInitialBills();

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error " + error);
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
    const oldUser = await listUser.findAllByKey('user_name', username);
    // const oldPwd = await listUser.findAllByKey('user_password', password);
    const isAdmin = await oldUser[0].isAdmin;

    try {
        if (username && password) {
            if (req.session.authenticated) {
                res.redirect('/');
            } else {
                if (username == oldUser[0].user_name && password == oldUser[0].user_password) {
                    req.session.authenticated = true;
                    req.session.user = {
                        username, password
                    };
                    if(isAdmin == 1){
                        req.session.isAdmin = true;
                        res.redirect('/admin');
                    }

                    // check if user isAdmin
                    if (isAdmin == 0) {
                        req.session.isAdmin = false;
                        res.redirect('/');
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
        navSelect: 0 + 4,
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
        navSelect: parseInt(categoryId) + 4,
    });

  });


// shpping cart

app.get("/cart", Authen.userAuthentication, function (req, res, next) {
    if(!req.session.cart) {
      return res.render('frontend/shoppingcart', {products: null});
    }
    let cart = new Cart(req.session.cart);
    //console.log(cart)
    res.render("frontend/shoppingcart", {
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
    });
  });

// add item to cart
app.get('/add-to-cart/:id', async function(req, res) {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
  
    const product = await listProduct.findByProductId(productId);
    if(!product) {
      return res.redirect('/');
    } else {
        //console.log(product.product_id);
      cart.add(product, product.product_id);
      req.session.cart = cart;
    //   console.log(req.session.cart);
      res.redirect('/product');
    }
  });

  // decrease qty of item when click 'minus' button in shopping-cart
app.get('/reduce/:reItem', function(req, res){
    let productId = req.params.reItem;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
  
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/cart');
  });
  
  // increase qty of item when click 'plus' button in shopping-cart
  app.get('/add/:reItem', function(req, res){
    let productId = req.params.reItem;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
  
    cart.increaseByOne(productId);
    req.session.cart = cart;
    res.redirect('/cart');
  });
  
  // remove all items when click 'bin' button in shopping-cart
  app.get('/remove/:reItem', function(req, res){
    let productId = req.params.reItem;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
  
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/cart');
  });


  // checkout order
  app.get("/checkout", Authen.userAuthentication, async function (req, res) {
    let cart = new Cart(req.session.cart);

    const products = cart.generateArray();

    let bill_id = Math.floor(Math.random() * 100000);

    const billStoreIDs = [];

    billStoreIDs.push(bill_id);

    products.forEach(async (product) =>{
        console.log(billStoreIDs[0]);
        const prodID = product.item.product_id;
        await listBill.createNewBill(cart.totalQty, cart.totalPrice, billStoreIDs[0], prodID)
        .then(function() {
          req.session.cart = null;
          res.redirect('/');
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  });
  

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

app.get('/admin/top_seller', Authen.adminAuthentication, async (req, res) => {
    const items = await listProduct.findAll();
    res.render("backoffice/top_seller", { pageName: "top_seller", products: items});
});

app.get('/admin/bills', Authen.adminAuthentication, async (req, res) => {
    const bills = await listBill.sortByBillDate();
    res.render("backoffice/sales_bills", { pageName: "bills", billLists: bills});
});

app.get('/admin/bills/id', Authen.adminAuthentication, async (req, res) => {
    const bills = await listBill.findAll();
    console.log(bills);
    res.render("backoffice/bills", { pageName: "bills/id", billLists: bills});
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

const PORT = 3500;
app.listen(PORT, () => {
    console.log('Server is running on port '+ PORT);
});
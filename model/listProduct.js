const BaseSQLModel = require("./baseSQLModel");

// Create a new class for a specific table
class ProductsModel extends BaseSQLModel {
  constructor() {
    super("product"); //table 'products'
  }

  //check if there is a record of todoItems in the database?
  // if there is no todoItems record, call setinitialItems() to define intial
  async defineInitialProducts() {
   
    const results = await this.findAll()
      .then((results) => {
        if (results[0] == undefined) {
          this.setinitialItems();
        } else {
          //console.log("All products:", results);
        }
      })
      .catch((error) => {
        console.error("Error retrieving users:", error);
      });

    return results;
  }

  async setinitialItems() {
    const shirt1 = new Product('Shirt 1', 'https://cdn.discordapp.com/attachments/1216787767233609818/1216788510472671304/20cce0c3014cb071508dba3a0c812ffb.png?ex=6601a99b&is=65ef349b&hm=b2a69e0423a03f49a47210e8814db42fa51fca7b6f038982f6eb3ca54e2385d9&', 1, 'New', 200.00, 180.00, 100);
    const shirt2 = new Product('Shirt 2', 'https://cdn.discordapp.com/attachments/1216787767233609818/1216788510846095410/6dea9f3e09acc40503e90121e46dd274.png?ex=6601a99b&is=65ef349b&hm=ccc5d4a1e289282137ce05968e92ce57f5f82db9c6673729abee9c56232607e3&', 1, 'New', 220.00, 200.00, 150);
    const shirt3 = new Product('Shirt 3', 'https://media.discordapp.net/attachments/1216787767233609818/1216788511156605070/ae3a0637923558dde2cae05674254e76.png?ex=6601a99b&is=65ef349b&hm=ce0e96f2525b6ec3311e8571eb80b69ffb3a4952bc112703b85f4b9a51ccb7c5&=&width=776&height=1034', 1, 'Sale', 240.00, 220.00, 200);
    const shirt4 = new Product('Shirt 4', 'https://cdn.discordapp.com/attachments/1216787767233609818/1216788511441555616/32cbe91fd7528764b6553f9bbe07c922.png?ex=6601a99b&is=65ef349b&hm=140b2cf742809f4dc4e5b9e91e6ca56a99707a027c6c6cf8c89c3e489168da09&', 1, 'Limited', 180.00, 160.50, 90);
    const shirt5 = new Product('Shirt 5', 'https://cdn.discordapp.com/attachments/1216787767233609818/1216788511689150464/92f610508ee304d0ce7221f286cda506.png?ex=6601a99c&is=65ef349c&hm=257e4bec5c46ed4878c4132cec4c425657939219b1913015f6562bd58a4f83fd&', 1, 'New', 250.00, 230.00, 120);
    const pant1 = new Product('Pants 1', 'https://cdn.discordapp.com/attachments/1216787767233609818/1216789034219606136/72139c1ad973f6cf0ea11f200f1b6637.png?ex=6601aa18&is=65ef3518&hm=205fc16620d06b7fa76db84aa2f6e8c9619ec54d892eec71b3b9ee2bcc8057d5&', 2, '', 300.00, 270.00, 80);
    const pant2 = new Product('Pants 2', 'https://cdn.discordapp.com/attachments/1216787767233609818/1216789034588967093/52776a5628f9e6e65355400b65d9f0bb.png?ex=6601aa18&is=65ef3518&hm=92a8016f91f9438b9874e1d6ab3eadf3d7cdfdbcb4e4ace63b2800bc07c83b44&', 2, 'Sale', 320.00, 290.00, 130);
    const pant3 = new Product('Pants 3', 'https://cdn.discordapp.com/attachments/1216787767233609818/1216789034924376215/3d24468c4229c63916b52fc0310fd2a5.png?ex=6601aa18&is=65ef3518&hm=c8d1d2bb977e77f3ab2b6f5a4348bf8060232d700b63136c0d7f22eb8d19ed66&', 2, '', 350.00, 320.00, 110);
    const pant4 = new Product('Pants 4', 'https://cdn.discordapp.com/attachments/1216787767233609818/1216789035280765038/70b8692f2d2474f5adffbc877fd53d58.png?ex=6601aa18&is=65ef3518&hm=b2bf42d2c0e2f65afafa7bb2e857627cbf209425ad8a941fc540117f36acb415&', 2, 'New', 280.00, 250.00, 95);
    const pant5 = new Product('Pants 5', 'https://cdn.discordapp.com/attachments/1216787767233609818/1216789035608183005/ee5ef241d569bc2406b0564aba306242.png?ex=6601aa18&is=65ef3518&hm=3652dc05a8af2de48c9d1f9020e6e484e47a142c7edd96b3e6ed538ffd5e29fa&', 2, 'Limited', 330.00, 300.00, 140);
    const shoes1 = new Product('Shoes 1', 'https://cdn.discordapp.com/attachments/1216787767233609818/1216789405952381090/93ad5dee35897323bc45449db529ecfb.png?ex=6601aa71&is=65ef3571&hm=92d417f911b8b487bb4190032e9515ddc7e16111a7d05d63a50aace26da67897&', 3, 'Sale', 500.00, 450.00, 75)
    const shoes2 = new Product('Shoes 2', 'https://cdn.discordapp.com/attachments/1216787767233609818/1216789405579345930/5d836affd14e6d61c63029377ce2a262.png?ex=6601aa71&is=65ef3571&hm=f47252d739bb2826f32a246f59f695623a7ee75a3dc78284293e8efcb80f687e&', 3, '', 550.00, 500.00, 65);
    const shoes3 = new Product('Shoes 3', 'https://cdn.discordapp.com/attachments/1216787767233609818/1216789406501965874/c1895db1e53c5b8ab880a8f8d885fa1c.png?ex=6601aa71&is=65ef3571&hm=5d42a2d1ebb371999dea02a8f5e59f53cdd6724387b6df588cbe2b1d5fa352bc&', 3, 'New', 600.00, 550.00, 85);
    const shoes4 = new Product('Shoes 4', 'https://cdn.discordapp.com/attachments/1216787767233609818/1216789406841831607/19e22a3cf61dcb884ae69d0aaa393a79.png?ex=6601aa71&is=65ef3571&hm=0b73539370d7713182a9b233303b42c3aa64808b1e58dde1727a8a1bb85c12c4&', 3, 'Limited', 520.00, 470.00, 70);
    const shoes5 = new Product('Shoes 5', 'https://cdn.discordapp.com/attachments/1216787767233609818/1216789407206477944/045623329e287575e9b74680936caa0e.png?ex=6601aa71&is=65ef3571&hm=8cdfe6a7f2a44297d9e8dfe0cf0adf90177ddf7078e37e9fcbc061383dbfb095&', 3, 'Sale', 580.00, 530.00, 90);

    const defaultItems = [shirt1, shirt2, shirt3, shirt4, shirt5, pant1, pant2, pant3, pant4, pant5, shoes1, shoes2, shoes3, shoes4, shoes5];

    defaultItems.forEach((item) =>
      this.create(item)
        .then((insertId) => {
          console.log("New user created with ID:", insertId);
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        })
    );
  }

  async getTodoItemsName(){
    const results =  await this.findByColumn('name');
    return results;

  }

  async addNewProduct(){

    const newItem = new Product('new item', 'new item link', 0, 'add tag', 0, 0, 0);

    const defaultItems = [newItem];

    defaultItems.forEach((item) =>
      this.create(item)
        .then((insertId) => {
          console.log("New user created with ID:", insertId);
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        })
    );

  }
}



const ProductsDB = new ProductsModel();

module.exports = ProductsDB;


// Define a template for Product
class Product {
    constructor(name, image, category, tag, price, price_promotion, sale_count){
        this.product_name = name, 
        this.product_image = image, 
        this.category_id = category, 
        this.product_tag = tag, 
        this.product_price = price, 
        this.product_price_promotion = price_promotion, 
        this.product_sales_count = sale_count
    }
}


// create table first
// CREATE TABLE `backoffice`.`product` (
//     `product_id` INT NOT NULL AUTO_INCREMENT,
//     `product_name` VARCHAR(45) NOT NULL,
//     `product_image` VARCHAR(999) NOT NULL,
//     `category_id` INT NOT NULL,
//     `product_tag` VARCHAR(45) NULL,
//     `product_price` DECIMAL(10,2) NOT NULL,
//     `product_price_promotion` DECIMAL(10,2) NOT NULL,
//     `product_sales_count` INT NOT NULL,
//     PRIMARY KEY (`product_id`));
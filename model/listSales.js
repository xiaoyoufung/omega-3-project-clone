const BaseSQLModel = require("./baseSQLModel");
const listProduct = require('./listProduct');

// Create a new class for a specific table
class SalesModel extends BaseSQLModel {
  constructor() {
    super("sales_history"); //table 'products'
  }

  //check if there is a record of todoItems in the database?
  // if there is no todoItems record, call setinitialItems() to define intial
  async defineInitialSalesHistory() {
   
    const results = await this.findAll()
      .then((results) => {
        if (results[0] == undefined) {
          this.setinitialItems();
        } else {
          console.log("All sales:", results);
        }
      })
      .catch((error) => {
        console.error("Error retrieving users:", error);
      });

    return results;
  }

  

  async setinitialItems() {
    const items = await listProduct.findAll();

    const defaultItems = []

    items.forEach((item) => {
      
      let iTem = {
        product_name: item.product_name,
        product_image: item.product_image,
        product_sales_count: item.product_sales_count,
        total_income: item.product_price_promotion * item.product_sales_count,
      };

      defaultItems.push(iTem);
    })

    // const item2 = {
    //     bill_id: 1,
    //     bill_date: new Date(),
    //     number_of_items: 0,
    //     product_id: 7,
    //     number_of_items: 3,
    //     bill_price: 23.55,
    // };
    // const item3 = {
    //     bill_id: 2,
    //     bill_date: new Date(),
    //     number_of_items: 10,
    //     product_id: 10,
    //     number_of_items: 5,
    //     bill_price: 23.55,
    // };

    //const defaultItems = [item1, item2, item3];

    defaultItems.forEach((item) =>
      this.create(item)
        .then((insertId) => {
          console.log("New bill created with ID:", insertId);
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        })
    );
  }

  async createNewBill(item_num, price, billId, productId){

    const newItem = {
      bill_date: new Date(),
      number_of_items: item_num,
      bill_price: price,
      bill_id: billId,
      product_id: productId
    };

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

const SalesDB = new SalesModel();

module.exports = SalesDB;
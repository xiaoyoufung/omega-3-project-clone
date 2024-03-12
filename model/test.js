const BaseSQLModel = require("./baseSQLModel");

// Create a new class for a specific table
class TestModel extends BaseSQLModel {
  constructor() {
    super("bill"); //table 'products'
  }

  speak() {
    console.log("Hello!");
  }

  //check if there is a record of todoItems in the database?
  // if there is no todoItems record, call setinitialItems() to define intial
  async defineInitialCategories() {
   
    const results = await this.findAll()
      .then((results) => {
        if (results[0] == undefined) {
          this.setinitialItems();
        } else {
          console.log("All categories:", results);
        }
      })
      .catch((error) => {
        console.error("Error retrieving users:", error);
      });

    return results;
  }

  async setinitialItems() {
    const item1 = {
      bill_date: new Date(),
      number_of_items: 5,
      bill_price: 23.55,
    };
    const item2 = {
        bill_date: new Date(),
        number_of_items: 0,
        bill_price: 23.55,
    };
    const item3 = {
        bill_date: new Date(),
        number_of_items: 10,
        bill_price: 23.55,
    };

    const defaultItems = [item1, item2, item3];

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
}

const TestDB = new TestModel();

module.exports = TestDB;
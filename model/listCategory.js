const BaseSQLModel = require("./baseSQLModel");

// Create a new class for a specific table
class CategoriesModel extends BaseSQLModel {
  constructor() {
    super("category"); //table 'products'
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
          //console.log("All categories:", results);
        }
      })
      .catch((error) => {
        console.error("Error retrieving users:", error);
      });

    return results;
  }

  async setinitialItems() {
    const item1 = {
      name: "Tops",
    };
    const item2 = {
      name: "Bottoms",
    };
    const item3 = {
      name: "Shoes",
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

const CategoriesDB = new CategoriesModel();

module.exports = CategoriesDB;
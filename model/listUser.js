const BaseSQLModel = require("./baseSQLModel");

// Create a new class for a specific table
class UsersModel extends BaseSQLModel {
  constructor() {
    super("user"); //table 'products'
  }

  //check if there is a record of todoItems in the database?
  // if there is no todoItems record, call setinitialItems() to define intial
  async defineInitialUsers() {
   
    const results = await this.findAll()
      .then((results) => {
        if (results[0] == undefined) {
          this.setinitialUsers();
        } else {
          console.log("All user:", results);
        }
      })
      .catch((error) => {
        console.error("Error retrieving users:", error);
      });

    return results;
  }

  async setinitialUsers() {
    const user1 = {
      user_name: "test",
      user_password: "1234",
      isAdmin: "0",
    };

    const admin1 = {
      user_name: "admin",
      user_password: "1111",
      isAdmin: "1"
    }

    const defaultUsers = [user1, admin1];

    defaultUsers.forEach((item) =>
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

  async getUserName(name){
    const results = this.findAllByKey("user_name", name);
    return results;
  }
}

const UsersDB = new UsersModel();

module.exports = UsersDB;
//Database methods to be performed on users

var sqlite3 = require('sqlite3').verbose();
let User = require('./User');

class UserDB {

    //function to import users from a csv
    static import() {

    }

    static allUsers() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * from Users', (err, response) => {
                   resolve(response.map((item) => new User(item)));
            });
         });
    }
    
    static findUser(id) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * from Users where (id == ${id})`, (err, rows) => {
                if (rows.length >= 1) {
                    resolve(new User(rows[0]));
                } else {
                    reject(`Id ${id} not found`);
                }
            });
        });
    }

    static createUser(desc) {
        let newUser = new User(desc);
        if (newUser.isValid()) {
            return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO Users (userID, fName, lName, guest) VALUES ("${newUser.userID}", "${newUser.fName}", "${newUser.lName}", "${newUser.guest}");`,
                    function(err, data) {
                        newUser.id = this.lastID;
                        resolve(newUser);
                    });
            });
        } else {
            return newUser;
        }
    }

    static updateUser(user) {
        this.db.run(`UPDATE Users SET userID="${user.userID}", fName="${user.fName}", lName="${user.lName}", guest="${user.guest}"`);
    }

    static removeUser(user) {
        this.db.run(`DELETE FROM Users WHERE id="${user.id}`);
    }
}

UserDB.db = new sqlite3.Database('users.sqlite');
module.exports = UserDB;
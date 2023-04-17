//Database methods to be performed on users

var sqlite3 = require('sqlite3').verbose();
let User = require('./user');

class UserDB {

    static initialize() {
        this.db.serialize(() => {
            this.db.run('DROP TABLE IF EXISTS Users');
            this.db.run(`CREATE TABLE Users (id INTEGER PRIMARY KEY, userID TEXT NOT NULL, fName TEXT NOT NULL, lName TEXT NOT NULL, guest INTEGER NOT NULL);`);
            this.db.run('INSERT INTO Users (userID, fName, lName, guest) VALUES ("quistsa", "Sam", "Quist", "0");');
            this.db.run('INSERT INTO Users (userID, fName, lName, guest) VALUES ("cades", "Selena", "Cade", "0");');
            this.db.run('INSERT INTO Users (userID, fName, lName, guest) VALUES ("kinneyni", "Nicole", "Kinney", "0");');
            this.db.run('INSERT INTO Users (userID, fName, lName, guest) VALUES ("skrobotr", "Ryan", "Skrobot", "0");');
            
        });
    }

    static allUsers() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * from Users ORDER BY lName ASC', (err, response) => {
                   resolve(response.map((item) => new User(item)));
            });
         });
    }
    
    static findUser(id) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Users WHERE (userID == ?)`, [id], (err, rows) => {
                if (rows.length >= 1) {
                    resolve(new User(rows[0]));
                } else {
                    console.log(`User id ${id} not found [userDB.findUser]`);
                    resolve(null);
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
        this.db.run(`UPDATE Users SET userID="${user.userID}", fName="${user.fName}", lName="${user.lName}", guest="${user.guest}" WHERE id="${user.id}"`);
    }

    static removeUser(user) {
        this.db.run(`DELETE FROM Users WHERE id="${user.id}"`);
    }
}

UserDB.db = new sqlite3.Database('scores.sqlite');
module.exports = UserDB;
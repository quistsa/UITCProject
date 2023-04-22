//Database methods to store and edit users, courses, and an array of scores for each faculty member and class

var sqlite3 = require('sqlite3').verbose();
let Score = require('./score');
let User = require('./user');
let Course = require('./course');
let Key = require('./key');

class ScoresDB {

    static allScores() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * from Scores ORDER BY courseID ASC', (err, response) => {
                   resolve(response.map((item) => new Score(item)));
            });
         });
    }

    //[TODO] dont think this is necessary
    static findScore(id) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * from Scores where (id == ${id})`, (err, rows) => {
                if (rows.length >= 1) {
                    resolve(new Score(rows[0]));
                } else {
                    console.log(`Score id ${id} not found [scoresDB.findScore]`);
                    resolve(null);
                }
            });
        });
    }

    //return list of scores for every user for a specified course [id]
    static searchByCourse(id) {
        return new Promise((resolve, reject) => {
          //join Users and Scores tables together in order to get first and last names of users in the same table, selecting only where courseID matches the given id
          this.db.all(`SELECT * FROM Scores INNER JOIN Users ON Users.userID == Scores.facultyID INNER JOIN Courses ON Courses.courseID == Scores.courseID WHERE (Courses.courseID == ?) ORDER BY Courses.courseID`,[id] , (err, rows, response) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              console.log(rows);
              console.log(response);
              if (rows.length >= 1) {
                resolve(rows.map((item) => new Score(item)));
              } else {
                console.log(`Course id ${id} not found [scoresDB.searchByCourse]`);
                resolve(null);
              }
            }
          });
        });
    }

    //return list of scores for every course for a specified user [id]
    static searchByUser(id) {
            return new Promise((resolve, reject) => {
            //need to select things only where courseID = id still
            this.db.all(`SELECT * FROM Scores INNER JOIN Courses ON Courses.courseID == Scores.courseID INNER JOIN Users ON Users.userID == Scores.facultyID WHERE (Users.userID == ?) ORDER BY Courses.courseID`,[id], (err, rows, response) => { 
                if (err) {
                    console.error(err);
                    reject(err);
                    } else {
                    console.log(rows);
                    console.log(response);
                    if (rows.length >= 1) {
                        resolve(rows.map((item) => new Score(item)));
                    } else {
                        console.log(`User id ${id} not found [scoresDB.searchByUser]`);
                        resolve(null);
                    }
                    }
                });
            });
        }

    //return scores for a particular user, given an id
    static scoresForUser(id) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Scores INNER JOIN Courses ON Courses.courseID == Scores.courseID WHERE (Scores.facultyID == ?) ORDER BY Courses.courseID`,[id] , (err, rows, response) => {
                if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    //console.log(rows);
                    //console.log(response);
                    if (rows.length >= 1) {
                      resolve(rows.map((item) => new Score(item)));
                    } else {
                        console.log(`User id ${id} not found [scoresDB.scoresForUser]`);
                        resolve(null);
                    }
                  }
            });
        });
    }

    //create a new score
    static addScore(desc) {
        let newScore = new Score(desc);
        if (newScore.isValid()) {
            return new Promise((resolve, reject) => {
                    this.db.run(`INSERT INTO Scores (facultyID, courseID, ranking, desire, notes) VALUES ("${newScore.facultyID}", "${newScore.courseID}", "${newScore.ranking}", "${newScore.desire}", "${newScore.notes}");`,
                    function(err, data) {
                        newScore.id = this.lastID;
                        resolve(newScore);
                    });
            });
        } else {
            return newScore;
        }
    }

    static updateScore(score) {
        this.db.run(`UPDATE Scores SET ranking="${score.ranking}", desire="${score.desire}", notes="${score.notes}" WHERE facultyID="${score.facultyID}" AND courseID="${score.courseID}"`);
    }

    // [TODO] not sure if necessary
    static removeScore(score) {
        this.db.run(`DELETE FROM Scores WHERE id="${score.id}"`);
    }

    //when a user's ID is updated, change associated score IDs
    static updateUserID(user, prevID) {
        this.db.run(`UPDATE Scores SET facultyID="${user.userID}" WHERE facultyID="${prevID}"`);
    }

    //when a user is deleted, remove associated scores
    static removeUserScores(user) {
        this.db.run(`DELETE FROM Scores WHERE facultyID="${user.userID}"`)
    }

    ///////////////////
    //user DB functions
    ///////////////////
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


    //////////////////////
    //course DB functions
    //////////////////////
    static allCourses() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * from Courses ORDER BY courseID ASC', (err, response) => {
                   resolve(response.map((item) => new Course(item)));
            });
         });
    }
    
    static findCourse(id) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * from Courses WHERE (courseID == ?)`,[id], (err, rows) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    //console.log(rows);
                    //console.log(response);
                    if (rows.length >= 1) {
                        resolve(new Course(rows[0]));
                    } else {
                        console.log(`Course id ${id} not found [courseDB.findCourse]`);
                        resolve(null);
                    }
                }
            });
        });
    }

    static createCourse(desc) {
        let newCourse = new Course(desc);
        if (newCourse.isValid()) {
            return new Promise((resolve, reject) => {
                    this.db.run(`INSERT INTO Courses (courseID, name) VALUES ("${newCourse.courseID}", "${newCourse.name}");`,
                    function(err, data) {
                        newCourse.id = this.lastID;
                        resolve(newCourse);
                    });
                    console.log("Course Created");
            });
        } else {
            return newCourse;
        }
    }

    static updateCourse(course) {
        this.db.run(`UPDATE Courses SET courseID="${course.courseID}", name="${course.name}" WHERE id="${course.id}"`);
    }

    static removeCourse(course) {
        this.db.run(`DELETE FROM Courses WHERE id="${course.id}"`);
    }


    ///////////////////////////////
    //ranking/desire key functions
    ///////////////////////////////
    static updateKey(key) {
        
    }
}

ScoresDB.db = new sqlite3.Database('scores.sqlite');
module.exports = ScoresDB;
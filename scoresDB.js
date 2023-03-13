//Database methods to store and edit array of scores for each faculty member and class

var sqlite3 = require('sqlite3').verbose();

let Score = require('./score');
let User = require('./User');
let Course = require('./course')

let userDB = require('./userDB');
let courseDB = require('./courseDB');

class ScoresDB {
//Database methods to store and edit courses

    static initialize() {
        this.db.serialize(() => {
            this.db.run('DROP TABLE IF EXISTS Scores');
            this.db.run(`CREATE TABLE Scores (id INTEGER PRIMARY KEY, userID INTEGER NOT NULL, courseID INTEGER NOT NULL, ranking INTEGER NOT NULL, desire INTEGER NOT NULL, notes TEXT);`);
            this.db.run('INSERT INTO Scores (userID, courseID, ranking, desire, notes) VALUES ("quistsa", "CIS 101", "1", "2", "no notes");');
            this.db.run('INSERT INTO Scores (userID, courseID, ranking, desire, notes) VALUES ("kinneyni", "CIS 450", "2", "2", "some notes");');
            this.db.run('INSERT INTO Scores (userID, courseID, ranking, desire, notes) VALUES ("cades", "CIS 160", "1", "3", "notenstnot");');
        });
    }

    //function to import users from a csv
    static import() {
        //[TODO]
    }

    static allScores() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * from Scores', (err, response) => {
                   resolve(response.map((item) => new Score(item)));
            });
         });
    }
    
    static findScore(userID, courseID) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Scores 
                            WHERE (userID == ${userID}) 
                            AND (courseID == ${courseID})`, (err, rows) => {
                if (rows.length >= 1) {
                    resolve(new Score(rows[0]));
                } else {
                    reject(`Id ${id} not found`);
                }
            });
        });
    }

    //return list of scores for every user for a specified course [id]
    static searchByCourse(id) {
        return new Promise((resolve, reject) => {
            //Users might have to be accessed a different way
            this.db.all(`SELECT Courses.id, fName, lName, ranking, desire, notes 
                            FROM Scores 
                            INNER JOIN Users ON Users.userID = Scores.userID`, (err, rows) => {
                if (rows.length >= 1) {
                    resolve(response.map((item) => new Course(item)));
                } else {
                    reject(`Course ID ${id} not found`);
                }
            });
        });
    }

    //return list of scores for every course for a specified user [id]
    static searchByUser(id) {
            return new Promise((resolve, reject) => {
            //Courses might have to be accessed a different way
            this.db.all(`SELECT courseID, ranking, desire 
                            FROM Scores 
                            INNER JOIN Courses 
                            ON Courses.courseID = Scores.courseID 
                            WHERE Courses.courseID == ${id}`, (err, rows) => {
                if (rows.length >= 1) {
                    resolve(response.map((item) => new Course(item)));
                } else {
                    reject(`User ID ${id} not found`);
                }
            });
        });
    }

    static addScore(desc) {
        let newScore = new Score(desc);
        if (newScore.isValid()) {
            return new Promise((resolve, reject) => {
                    this.db.run(`INSERT INTO Scores (userID, courseID, prepVal, prefVal, notes) 
                                    VALUES ("${newScore.userID}", "${newScore.courseID}", "${newScore.ranking}", "${newScore.ranking}", "${newScore.notes}");`,
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
        this.db.run(`UPDATE Courses 
                        SET userID="${score.userID}, courseID="${score.courseID}", ranking="${score.ranking}", desire="${score.desire}, notes="${score.notes}`);
    }

    static removeScore(score) {
        //might experiment with setting all values to 0 rather than deleting entry
        this.db.run(`DELETE FROM Courses 
                        WHERE id="${score.id}`);
    }
}

ScoresDB.db = new sqlite3.Database('scores.sqlite');
module.exports = ScoresDB;
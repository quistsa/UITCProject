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
            this.db.run(`CREATE TABLE Scores (id INTEGER PRIMARY KEY, facultyID FOREIGN KEY NOT NULL, courseID FOREIGN KEY NOT NULL, prepValue INTEGER NOT NULL, prefValue INTEGER NOT NULL, notes TEXT);`);
            this.db.run('INSERT INTO Courses (facultyID, courseID, prepValue, prefValue, notes) VALUES ("quistsa", "CIS 101", "1", "2", "no notes");');
        });
    }

//function to import users from a csv
    static import() {
        //[TODO]
    }
    
    static findScore(facultyID, courseID) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Scores WHERE (facultyID == ${facultyID}) AND (courseID == ${courseID})`, (err, rows) => {
                if (rows.length >= 1) {
                    resolve(new Score(rows[0]));
                } else {
                    reject(`Id ${id} not found`);
                }
            });
        });
    }

    static addScore(desc) {
        let newScore = new Score(desc);
        if (newScore.isValid()) {
            return new Promise((resolve, reject) => {
                    this.db.run(`INSERT INTO Scores (facultyID, courseID, prepVal, prefVal, notes) VALUES ("${newScore.facultyID}", "${newScore.courseID}", "${newScore.prepValue}", "${newScore.prepValue}", "${newScore.notes}");`,
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
        this.db.run(`UPDATE Courses SET facultyID="${score.facultyID}, courseID="${score.courseID}", prepValue="${score.prepValue}", prefValue="${score.prefValue}, notes="${score.notes}`);
    }

    static removeScore(score) {
        //might experiment with setting all values to 0 rather than deleting entry
        this.db.run(`DELETE FROM Courses WHERE id="${score.id}`);
    }
}

module.exports = ScoresDB;
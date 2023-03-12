//Database methods to store and edit courses

var sqlite3 = require('sqlite3').verbose();
let Course = require('./course');

class CourseDB {

    static initialize() {
        this.db.serialize(() => {
            this.db.run('DROP TABLE IF EXISTS Courses');
            this.db.run(`CREATE TABLE Courses (id INTEGER PRIMARY KEY, courseID TEXT NOT NULL, name TEXT NOT NULL);`);
            this.db.run('INSERT INTO Courses (courseID, name) VALUES ("CIS 101", "Introduction to Computing");');
            this.db.run('INSERT INTO Courses (courseID, name) VALUES ("CIS 160", "Learn to Code Python");');
            this.db.run('INSERT INTO Courses (courseID, name) VALUES ("CIS 260", "Application Development in Visual Basic");');
            this.db.run('INSERT INTO Courses (courseID, name) VALUES ("CIS 450", "IS Project Management");');
            this.db.run('INSERT INTO Courses (courseID, name) VALUES ("CIS 463", "Information Technology Project");');
        });
    }

//function to import users from a csv
    static import() {
        //[TODO]
    }

    static allCourses() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * from Courses', (err, response) => {
                   resolve(response.map((item) => new Course(item)));
            });
         });
    }
    
    static findCourse(id) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * from Courses where (id == ${id})`, (err, rows) => {
                if (rows.length >= 1) {
                    resolve(new Course(rows[0]));
                } else {
                    reject(`Id ${id} not found`);
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
            });
        } else {
            return newCourse;
        }
    }

    static updateCourse(course) {
        this.db.run(`UPDATE Courses SET courseID="${course.courseID}", name="${course.name}"`);
    }

    static removeCourse(course) {
        this.db.run(`DELETE FROM Courses WHERE id="${course.id}`);
    }
}

CourseDB.db = new sqlite3.Database('users.sqlite');

module.exports = CourseDB;
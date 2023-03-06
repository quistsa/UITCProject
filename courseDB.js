//Database methods to store and edit courses

var sqlite3 = require('sqlite3').verbose();
let Course = require('./course');

class CourseDB {
//function to import users from a csv
    static import() {

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
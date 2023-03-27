// used to perform operations on courses (create, edit, show)

const { test } = require('media-typer');

const Course = require('./course');

const courseDB = require('./courseDB');
const scoresDB = require('./scoresDB')
const userDB = require('./userDB');

class CourseController{
    //return list of all courses
    async index(req, res) {
        let courses = await courseDB.allCourses();
        res.render('course/courseList', { courses: courses });
    }

    //search list of courses by user
    async searchByUser(req, res) {
        let id = req.params.id;

        if (!id){ 
            id = 1;
        }

        let scores = await scoresDB.searchByUser(id);
        let users = await userDB.allUsers();

        if (!scores) {
            res.send("Couldn't find a user with ID of " + id);
            //[TODO] redirect to adminFaculty with error message
        } else {
            res.render('admin/adminFaculty', { scores: scores, users: users, facultyID: id });
        }
    }

    async searchByCourse(req, res) {
        let id = req.params.id;
        
        if (!id){ 
            id = "CIS101";
        }

        let scores = await scoresDB.searchByCourse(id);
        let courses = await courseDB.allCourses();

        if (!scores) {
            res.send("Couldn't find a course with ID of " + id);
            //[TODO] redirect to adminCourse with error message
        } else {
            res.render('admin/adminCourse', { scores: scores, courses: courses, courseID: id });
        }
    }

    //not currently used or necessary
    async show(req, res) {
        let id = req.params.id;
        let course = await courseDB.findCourse(id);

        if (!course) {
            res.send("Couldn't find a course with ID of " + id);
            //[TODO] 404 redirect
        } else {
            res.render('showCourse', { course: course });
        }
    }

    newCourse(req, res) {
        res.render('course/courseForm', { course: new Course() });
    }

    async create(req, res) {
        console.log("Creating new course");
        
        let newCourse = await courseDB.createCourse(req.body.course);

        if (newCourse.isValid()) {
            res.writeHead(302, { 'Location': `/courses/${ newCourse.id }`});
            res.end();
        } else {
            res.render('course/courseForm', { course: newCourse });
        }
    }

    async edit(req, res) {
        let id = req.params.id;
        let course = await courseDB.findCourse(id);

        if (!course) {
            console.log("no course with ID of " + id);
            //[TODO] redirect to courseForm with error message
        } else {
            res.render('course/courseForm', { course: course });
        }
    }

    async update(req, res) {
        let id = req.params.id;
        let course = await courseDB.findCourse(id);

        let testCourse = new Course(req.body.course);
        if (!testCourse.isValid()) {
            testCourse.id = course.id;
            res.render('course/courseForm', { course: testCourse });
            return;
        }

        if (!course) {
            res.send("Could not find course with id of " + id);
            //[TODO] redirect to courseForm with error message
        } else {
            course.courseID = req.body.course.courseID;
            course.name = req.body.course.name;

            console.log("Updating course");
            courseDB.update(course);

            res.writeHead(302, { 'Location': `/courses` });
            res.end();
        }
    }

    async delete(req, res) {
        let id = req.params.id;
        let course = await courseDB.findCourse(id);
        

        if (!course) {
            res.send("Couldn't find a course with id " + id);
            //[TODO] redirect to courseList with error message
        } else {
            courseDB.removeCourse(course);
            let courses = await courseDB.allCourses();
            res.render('course/courseList', { courses: courses });
        }
    }

    async rawIndex(req, res) {
        let courses = await courseDB.allCourses();
        res.send(courses);
    }
}

module.exports = CourseController;
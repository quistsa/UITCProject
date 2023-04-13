// used to perform operations on courses (create, edit, show)

const { test } = require('media-typer');

const Course = require('./course');

const courseDB = require('./courseDB');
const scoresDB = require('./scoresDB');
const userDB = require('./userDB');

class CourseController{
    //return list of all courses
    async index(req, res) {
        let courses = await courseDB.allCourses();
        res.render('course/courseList', { courses: courses });
    }

    //not currently used or necessary
    async show(req, res) {
        let id = req.params.id;
        let course = await courseDB.findCourse(id);

        if (course == null) {
            let errormsg = "Could not find a course with an ID of " + id;
            let btnmsg = "Return to course list";
            let btnPath = "/courses";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            res.render('showCourse', { course: course });
        }
    }

    newCourse(req, res) {
        res.render('course/courseForm', { course: new Course() });
    }

    async create(req, res) {
        console.log("Creating new course");
        
        let newCourse = await courseDB.create(req.body.course);

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

        if (course == null) {
            let errormsg = "Could not find a course with an ID of " + id;
            let btnmsg = "Return to course list";
            let btnPath = "/courses";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            res.render('course/courseForm', { course: course });
        }
    }

    async update(req, res) {
        //update variables for a course
        let id = req.params.id;
        let course = await courseDB.findCourse(id);

        let testCourse = new Course(req.body.course);
        if (!testCourse.isValid()) {
            testCourse.id = course.id;
            res.render('course/courseForm', { course: testCourse });
            return;
        }

        if (course == null) {
            let errormsg = "Could not find a course with an ID of " + id;
            let btnmsg = "Return to course list";
            let btnPath = "/courses";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
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
        

        if (course == null) {
            let errormsg = "Could not find a course with an ID of " + id;
            let btnmsg = "Return to course list";
            let btnPath = "/courses";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            courseDB.remove(course);
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
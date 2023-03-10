// used to perform operations on courses (create, edit, show)

const { test } = require('media-typer');
const Course = require('./course');
const courseDB = require('./courseDB');

class CourseController{
    //return list of all courses
    async index(req, res) {
        let courses = await courseDB.allCourses();
        res.render('courseList', { courses: courses });
    }

    async show(req, res) {
        let id = req.params.id;
        let course = await courseDB.findCourse(id);

        if (!course) {
            res.send("Couldn't find a course with ID of " + id);
        } else {
            res.render('showCourse', { course: course  });
        }
    }

    newCourse(req, res) {
        res.render('newCourse', {course: new Course()});
    }

    async create(req, res) {
        console.log("Creating new course");
        
        let newCourse = await courseDB.createCourse(req.body.course);

        if (newCourse.isValid()) {
            res.writeHead(302, { 'Location': `/courses/${newCourse.id}`});
            res.end();
        } else {
            res.render('newCourse', { course: newCourse });
        }
    }

    async edit(req, res) {
        let id = req.params.id;
        let course = await courseDB.findCourse(id);

        if (!course) {
            res.send("Couldn't find a course with id " + id);
        } else {
            res.render('courseEdit', { course: course });
        }
    }

    async update(req, res) {
        let id = req.params.id;
        let course = await courseDB.findCourse(id);

        let testCourse = new Course(req.body.course);
        if (!testCourse.isValid()) {
            testCourse.id = course.id;
            res.render('courseEdit', { course: testCourse });
            return;
        }

        if (!course) {
            res.send("Could not find course with id of " + id);
        } else {
            course.name = req.body.course.name;

            console.log("Updating course");
            courseDB.update(course);

            res.writeHead(302, { 'Location': `/courses/${course.id}` });
            res.end();
        }
    }

    async delete(req, res) {
        let id = req.params.id;
        let course = await courseDB.findCourse(id);
        

        if (!course) {
            res.send("Couldn't find a course with id " + id);
        } else {
            courseDB.removeCourse(course);
            let courses = await courseDB.allCourses();
            res.render('courseIndex', { courses: courses });
        }
    }

    async rawIndex(req, res) {
        let courses = await courseDB.allCourses();
        res.send(courses);
    }
}

module.exports = CourseController;
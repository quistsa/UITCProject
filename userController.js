// used to perform operations on users (create, edit, show)

const { test } = require('media-typer');
const User = require('./user');
const userDB = require('./userDB');
const courseDB = require('./courseDB');
const scoresDB = require('./scoresDB');


class UserController{
    //retun list of all users
    async index(req, res) {
        let users = await userDB.allUsers();
        res.render('facultyList', { users: users });
    }

    //redirect for 404 and 401 errors
    async error404(req, res) {
        res.render('404error');
    }    

    async error401(req, res) {
        res.render('401error');
    }

    //admin functions
    async adminFaculty(req, res) {
        let users = await userDB.allUsers();
        let courses = await courseDB.allCourses();
        let scores = await scoresDB.allScores();
        res.render('adminFaculty', { users: users,  courses: courses, scores: scores });
    }

    async adminCourse(req, res) { 
        let courses = await courseDB.allCourses();
        let users = await userDB.allUsers();
        let scores = await scoresDB.allScores();
        res.render('adminCourse', { courses: courses, users: users, scores: scores });
    }

    async adminEdit(req, res) {
        res.render('adminEdit');
    }

    async courseForm(req, res) {
        res.render('courseForm');
    }

    async facultyForm(req, res) {
        res.render('facultyForm');
    }

    async faculty(req, res) {
        //let id = req.params.id;

        let courses = await courseDB.allCourses();
        //let user = await userDB.findUser(id);
        //let scores = await scoresDB.scoresForUser(id);
        //if (!user) {
        //    res.send("Couldn't find a user with ID of " + id);
        //} else {
            res.render('faculty', { courses: courses }); //, user: user, scores: scores 
        //}
    }

    async show(req, res) {
        let id = req.params.id;
        let user = await userDB.findUser(id);

        if (!user) {
            res.send("Couldn't find a user with ID of " + id);
        } else {
            res.render('showUser', { user: user  });
        }
    }

    newUser(req, res) {
        res.render('newUser', {user: new User()});
    }

    async create(req, res) {
        console.log("Creating new user");
        
        let newUser = await userDB.createUser(req.body.user);

        if (newUser.isValid()) {
            res.writeHead(302, { 'Location': `/users/${newUser.id}`});
            res.end();
        } else {
            res.render('newUser', { user: newUser });
        }
    }

    async edit(req, res) {
        let id = req.params.id;
        let user = await userDB.findUser(id);

        if (!user) {
            res.send("Couldn't find a user with id " + id);
        } else {
            res.render('adminEdit'); //, { user: user }
        }
    }

    async update(req, res) {
        console.log("update")
        //update variables for a user
            let id = req.params.id;
            let user = await userDB.findUser(id);

            let testUser = new User(req.body.car);
            if (!testUser.isValid()) {
                testUser.id = user.id;
                res.render('facultyForm', { user: testUser });
            }

            if (!user) {
                res.send("Could not find user with id of " + id);
            } else {
                user.userID = req.body.user.userID;
                user.fName = req.body.user.fName;
                user.lName = req.body.user.lName;
                user.guest = req.body.user.guest;
                
            }

            console.log("Updating user");
            userDB.update(user);

           res.writeHead(302, { 'Location': `/users/${user.id}` });
           res.end();
    }

    async delete(req, res) {
        console.log("delete :)")
        let id = req.params.id;
        let user = await userDB.findUser(id);
        

        if (!user) {
            res.send("Couldn't find a user with id " + id);
        } else {
            userDB.removeUser(user);
            let users = await userDB.allUsers();
            res.render('userIndex', { users: users });
        }
    }

    async rawIndex(req, res) {
        let users = await userDB.allUsers();
        res.send(users);
    }
}

module.exports = UserController;
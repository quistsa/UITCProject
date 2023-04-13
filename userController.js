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
        res.render('faculty/facultyList', { users: users });
    }

    //redirect for 404 and 401 errors
    async error404(req, res) {
        res.render('404error');
    }    

    async error401(req, res) {
        res.render('401error');
    }

    //not currently used or necessary
    async show(req, res) {
        let id = req.params.id;
        let user = await userDB.findUser(id);

        if (user == null) {
            let errormsg = "Could not find a user with an ID of " + id;
            let btnmsg = "Return to faculty list";
            let btnPath = "/users";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            res.render('faculty/facultyShow', { user: user  });
        }
    }

    newUser(req, res) {
        console.log("rendering faculty form");
        res.render('faculty/facultyForm', { user: new User() });
    }

    async create(req, res) {
        console.log("Creating new user");
        
        let newUser = await userDB.createUser(req.body.user);

        if (newUser.isValid()) {
            res.writeHead(302, { 'Location': `/users/${newUser.id}`});
            res.end();
        } else {
            res.render('faculty/facultyForm', { user: newUser });
        }
    }

    async edit(req, res) {
        let id = req.params.id;
        let user = await userDB.findUser(id);

        if (user == null) {
            let errormsg = "Could not find a user with an ID of " + id;
            let btnmsg = "Return to faculty list";
            let btnPath = "/users";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            res.render('faculty/facultyForm', { user: user });
        }
    }

    async update(req, res) {
        //update variables for a user
        let id = req.params.id;
        let user = await userDB.findUser(id);

        let testUser = new User(req.body.user);
        if (!testUser.isValid()) {
            testUser.id = user.id;
            res.render('faculty/facultyForm', { user: testUser });
            return;
        }

        if (user == null) {
            let errormsg = "Could not find a user with an ID of " + id;
            let btnmsg = "Return to faculty list";
            let btnPath = "/users";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            let prevID = user.userID;
            user.fName = req.body.user.fName;
            user.lName = req.body.user.lName;
            user.userID = req.body.user.userID;
            user.guest = req.body.user.guest;

            console.log("Updating user");
            userDB.updateUser(user);
            scoresDB.updateUserID(user, prevID);

            res.writeHead(302, { 'Location': `/users/${user.id}` });
            res.end();
        }
    }

    async delete(req, res) {
        let id = req.params.id;
        let user = await userDB.findUser(id);
        

        if (user == null) {
            let errormsg = "Could not find a user with an ID of " + id;
            let btnmsg = "Return to faculty list";
            let btnPath = "/users";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            userDB.removeUser(user);
            scoresDB.removeUserScores(user);
            let users = await userDB.allUsers();
            res.render('faculty/facultyList', { users: users });
        }
    }

    async rawIndex(req, res) {
        let users = await userDB.allUsers();
        res.send(users);
    }
}

module.exports = UserController;
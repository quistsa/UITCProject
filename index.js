//index.js verifies authentication and handles web requests to redirect users to the different pages
//Sam Quist, Up In The Cloud Computing

const express = require('express');
const session = require('express-session');

const UserController = require('./userController');
const userController = new UserController();

const LoginController = require('./loginController');
const loginController = new LoginController();

const bodyParser = require('body-parser');
const { response } = require('express');

//start server
const app = express();
const port = 3000;

//session info
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'abcdefghijklmnopqrstuvwxzy'
}));

//create public folder for css files
app.use(express.static(__dirname + '/public'));

//check if users have logged in when requesting login-required pages
function isAuthenticated(req, res, next) {

    console.log('Enter isAuthenticated')
    console.log(req.session)
    if (req.session.user) {
        console.log("Already logged in :)")
        next()
    } else {
        console.log("redirecting to login page")
        res.redirect('/login')
    }
}

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

//redirect to login page when root directory is requested
app.get('/', (req, res) =>{
    //[TODO] redirect users to respective pages if they're already logged in
    loginController.loginPage(req, res);
})

//login redirects
/////////////////////////////////////////
app.get('/login', (req, res) => {
    loginController.loginPage(req, res);
})

app.post('/login', (req, res) => {
    loginController.requestLogin(req, res);
})

app.get('/logout', (req, res) => {
    loginController.logout(req, res); // this doesnt work yet :)
})
//////////////////////////////////////////

//admin redirects
//////////////////////////////////////////
app.get('/adminFaculty', isAuthenticated, (req, res) => {
    //when an admin logs in, use the userController to send them to the admin view, which lists all courses and faculty responses
    userController.adminFaculty(req, res);
})

app.get('/adminCourse', isAuthenticated, (req, res) => {
    userController.adminCourse(req, res);
})

app.get('/courseForm', isAuthenticated, (req, res) => {
    userController.courseForm(req, res);
})

app.get('/facultyForm', isAuthenticated, (req, res) => {
    userController.facultyForm(req, res);
})

//app.post('/admin', (req, res) => {
    //create new admin on post request, [TODO] make sure user is an admin, faculty should not be able to create new users
//    userController.newAdmin(req, res);
//})
/////////////////////////////////////////

//faculty redirects
/////////////////////////////////////////
app.get('/faculty', isAuthenticated, (req, res) => {
    //when a faculty user logs in, use the userController to send them to the faculty view, which should match the user's responses with their ID using mongoDB
    userController.faculty(req, res);
})

app.post('/faculty', (req, res) => {
    //create new faculty on post request, [TODO] make sure user is an admin, faculty should not be able to create new users
    userController.newFaculty(req, res);
})
//////////////////////////////////////////

//courses redirects
//////////////////////////////////////////
app.get('/courses', (req, res) => {
    //when the course list is requested, use courseController to retrieve all courses
    //[not sure if necessary]
    courseController.index(req, res);
})

app.post('/courses', (req, res) => {
    //create new course on post request for /courses
    courseController.create(req, res);
})

app.get('/courses/new', (req, res) => {
    //display form for creating a new course 
    courseController.newCourse(req, res);
})
//////////////////////////////////////////

/////////////////////
//launch the server//
/////////////////////
app.listen(port, () => console.log(`Example listening on port ${port}`));
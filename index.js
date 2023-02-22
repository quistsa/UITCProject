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

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) =>{
    loginController.loginPage(req, res);
})

app.get('/login', (req, res) => {
    loginController.loginPage(req, res);
})

app.post('/login', (req, res) => {
    loginController.requestLogin(req, res);
})

app.get('/logout', (req, res) => {
    loginController.logout(req, res); // this doesnt work yet :)
})

app.get('/admin', isAuthenticated, (req, res) => {
    //when an admin logs in, use the userController to send them to the admin view, which lists all classes and faculty responses
    userController.admin(req, res);
})

app.post('/admin', (req, res) => {
    //create new admin on post request, ****make sure user is an admin, faculty should not be able to create new users
    userController.newAdmin(req, res);
})

app.post('/faculty', (req, res) => {
    //create new faculty on post request, ****make sure user is an admin, faculty should not be able to create new users
    userController.newFaculty(req, res);
})

app.get('/faculty', isAuthenticated, (req, res) => {
    //when a faculty user logs in, use the userController to send them to the faculty view, which should match the user's responses with their ID using mongoDB
    userController.faculty(req, res);
})

app.get('/classes', (req, res) => {
    //when the class list is requested, use classController to retrieve all classes
    classController.index(req, res);
})

app.post('/classes', (req, res) => {
    //create new class on post request for /classes
    classController.create(req, res);
})

app.get('/classes/new', (req, res) => {
    //display form for creating a new class 
    classController.newClass(req, res);
})

/////////////////////
//launch the server//
/////////////////////
app.listen(port, () => console.log(`Example listening on port ${port}`));
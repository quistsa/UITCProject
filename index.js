    //index.js verifies authentication and handles web requests to redirect users to the different pages
//Sam Quist, Up In The Cloud Computing

const express = require('express');
const session = require('express-session');
const favicon = require('express-favicon');

const UserController = require('./userController');
const userController = new UserController();

const CourseController = require('./courseController');
const courseController = new CourseController();

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

//create public folder for css and image files
app.use(express.static(__dirname + '/public'));

//favicon handling
app.use(favicon(__dirname + '/public/images/favicon.ico'));

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

//////////////////////////////////////////
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

app.get('/courseSearch', (req, res) => { //[TODO] add isAuthenticated later
    courseController.searchByCourse(req, res);
})

app.get('/courseSearch/:id', (req, res) => {
    courseController.searchByCourse(req, res);
})

app.get('/userSearch/', (req, res) => {
    courseController.searchByUser(req, res);
})

app.get('/userSearch/:id', (req, res) => {
    courseController.searchByUser(req, res);
})

//app.post('/admin', (req, res) => {
    //create new admin on post request, [TODO] make sure user is an admin, faculty should not be able to create new users
//    userController.newAdmin(req, res);
//})

/////////////////////////////////////////
//faculty redirects
/////////////////////////////////////////
app.get('/faculty', (req, res) => { //add isAuthenticated later
    //when a faculty user logs in, use the userController to send them to the faculty view, which should match the user's responses with their ID using mongoDB
    userController.faculty(req, res);
})

app.post('/faculty', (req, res) => {
    //create new faculty on post request, [TODO] make sure user is an admin, faculty should not be able to create new users
    userController.newFaculty(req, res);
})

app.get('/faculty/init', (req, res) => {
    require('./userDB').initialize();
    res.send("Initialized");
})

app.get('/facultyForm', isAuthenticated, (req, res) => {
    userController.facultyForm(req, res);
})

app.get('/users', (req, res) => {
    userController.index(req, res);
})

app.get('/users/new', (req, res) => {
    userController.newUser(req, res);
})

app.get('/users/:id/edit', (req, res) => {
    userController.edit(req, res);
})

app.get('/users/:id/edit', (req, res) => {
    userController.edit(req, res);
})

//////////////////////////////////////////
//courses redirects
//////////////////////////////////////////
app.get('/courses', (req, res) => {
    //when the course list is requested, use courseController to retrieve all courses
    courseController.index(req, res);
})

app.post('/courses', (req, res) => {
    //create new course on post request for /courses
    courseController.create(req, res);
})

//initilization for testing
app.get('/courses/init', (req, res) => {
    require('./courseDB').initialize();
    res.send("Initialized");
})

app.get('/courses/new', (req, res) =>{ 
    //display form for creating a new course 
    courseController.newCourse(req, res);
})

app.get('/courseForm', isAuthenticated, (req, res) => {
    userController.courseForm(req, res);
})

app.get('/courses/:id', (req, res) => {
    courseController.index(req, res);
})

app.post('/courses/:id', (req, res) => {
    courseController.update(req, res);
})

app.get('/courses/:id/edit', (req, res) => {
    //display form for updating a course 
    courseController.edit(req, res);
})

app.get('/courses/:id/delete', (req, res) => {
    //display form for updating a course 
    courseController.delete(req, res);
})

//////////////////////////////////////////
//scores redirects
//////////////////////////////////////////
//initilization for testing
app.get('/scores/init', (req, res) => {
    require('./scoresDB').initialize();
    res.send("Initialized");
})

//////////////////////////////////////////
//error redirects
//////////////////////////////////////////
app.get('/404', (req, res) => {
    userController.error404(req, res);
});

app.get('/401', (req, res) => {
    userController.error401(req, res);
});

//handling 404 redirects
app.use((req, res, next) => {
    res.status(404).render('404error', {
      pageTitle: 'Page Not Found'
    });
});

app.use((req, res, next) => {
    res.status(401).render('401error', {
      pageTitle: 'Page Not Found'
    });
});

/////////////////////
//launch the server//
/////////////////////
app.listen(port, () => console.log(`Example listening on port ${port}`));
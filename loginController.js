var Users = require ('./userDB'); //for checking user IDs

class LoginController {

    loginPage(req, res) {
        res.render('login', { message: 'Please login' })
    }

    requestLogin(req, res, next) {

        console.log("Request body")
        console.log(req.body)
        //[TODO] check database for userIDs
        //[TODO] verify that user input matches an entry in the user database
        const admin = "admin"; //these can go away once user verification works properly
        const faculty = "faculty";
        if (req.body.username !== admin && req.body.username !== faculty) {
            res.render("login", { message: 'Incorrect user ID' });
        } else {
            console.log("Creating new session");
            req.session.regenerate((err) => {
                if (err) next(err)
                req.session.user = req.body.username;
                console.log('here!');
                if (req.body.username == admin){
                    res.redirect('/courseSearch'); //only if user is admin, otherwise /faculty
                } else {
                    res.redirect('/faculty/'); // + req.body.username
                }
            })
        }
    }
    
    logout(req, res) {
        req.session.destroy(function(){
            res.redirect('/login');
          });
    }
}

module.exports = LoginController;
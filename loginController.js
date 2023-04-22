var userDB = require ('./scoresDB'); //for checking user IDs

class LoginController {

    loginPage(req, res) {
        res.render('login', { message: 'Please login' })
    }

    async requestLogin(req, res, next) {

        console.log("Request body")
        console.log(req.body)

        if (req.body.userID == "UITCAdmin2023"){ //since only one admin login is used in this version, the username is hardcoded. If more admin users are required, follow comments in the user.js and facultyForm.ejs files.
            res.redirect('/courseSearch'); // only if user is admin, otherwise /faculty
            return;
        }

        let user = await userDB.findUser(req.body.userID);

        if(!user || user == null){
            res.render("login", { message: 'Incorrect user ID' });
        } else {
            console.log("Creating new session");
            req.session.regenerate((err) => {
                if (err) next(err)
                req.session.user = req.body.userID;
                    res.redirect('/faculty/' + user.userID);
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
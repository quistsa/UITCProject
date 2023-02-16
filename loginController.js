
class LoginController {

    loginPage(req, res) {
        res.render('login', { message: 'Please login to view your cars' })
    }

    requestLogin(req, res, next) {

        console.log("Request body")
        console.log(req.body)
        //****check database for userIDs
        //****verify that user input matches
            console.log("Creating new session");
            req.session.regenerate((err) => {
                if (err) next(err)
                req.session.user = req.body.username;
                console.log('here!');
                res.redirect('/admin'); //*****only if user is admin, otherwise /faculty
            })
        }
    
    logout(req, res) {
        req.session.destroy(function(){
            res.redirect('/login');
          });
    }
}

module.exports = LoginController


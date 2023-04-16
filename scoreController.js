const Score = require('./score');

const scoresDB = require('./scoresDB');
const courseDB = require('./courseDB');
const userDB = require('./userDB');

class ScoreController {

    async init(req, res) {
        scoresDB.initialize();
    }

    //search list of scores by user
    async searchByUser(req, res) {
        let id = req.params.id;

        let users = await userDB.allUsers();

        if (!id){ 
            id = users[0].userID;
        }

        let scores = await scoresDB.searchByUser(id);
        let courses = await courseDB.allCourses();

        if (scores == null) {
            let errormsg = "There is no user with an ID of '" + id + "' or the requested user has no entered scores.";
            let btnmsg = "Return to course search";
            let btnPath = "/facultySearch/";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            res.render('admin/adminFaculty', { scores: scores, courses: courses, users: users, facultyID: id });
        }
    }

    async searchByCourse(req, res) {
        let id = req.params.id;
        
        if (!id){ 
            id = "CIS101";
        }

        let scores = await scoresDB.searchByCourse(id);
        let courses = await courseDB.allCourses();
        let users = await userDB.allUsers();

        if (scores == null) {
            let errormsg = "There is no course with an ID of '" + id + "' or the requested course has no entered scores.";
            let btnmsg = "Return to course search";
            let btnPath = "/courseSearch/";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            res.render('admin/adminCourse', { courses: courses, scores: scores, users: users, courseID: id });
        }
    }

    async faculty(req, res) {
        let id = req.params.id;

        let courses = await courseDB.allCourses();
        let user = await userDB.findUser(id);
        let scores = await scoresDB.scoresForUser(id);
        let scoreObj = new Score();

        if (user == null) {
            let errormsg = "There is no user with an ID of '" + id + "' or the requested user has no entered scores.";
            let btnmsg = "Return to login page";
            let btnPath = "/login";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            res.render('faculty/faculty', { courses: courses, user: user, scores: scores, scoreObj: scoreObj });
        }
    }

    // [TODO] not used
    newScore(req, res) {
        res.render('score/scoreForm', { score: new Score() });
    }

    async create(req, res) {
        console.log("Creating new score");
        
        let newScore = await scoresDB.addScore(req.body.score);

        if (newScore.isValid()) {
            res.writeHead(302, { 'Location': `/scores/${ newScore.id }`});
            res.end();
        } else {
            this.faculty(req, res);
        }
    }

    //[TODO] not used
    async edit(req, res) {
        let id = req.params.id;
        let score = await scoresDB.findScore(id);

        if (!score) {
            let errormsg = "Could not find a score with an ID of " + id;
            let btnmsg = "Return to login page";
            let btnPath = "/login";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            res.render('score/scoreForm', { score: score });
        }
    }

    async update(req, res) {
        //update variables for a score
        let id = req.params.id;
        let score = await scoresDB.findScore(id);

        let testScore = new Score(req.body.score);
        if (!testScore.isValid()) {
            testScore.id = score.id;
            return;
        }

        if (score == null) {
            let errormsg = "Could not find a score with an ID of " + id;
            let btnmsg = "Return to login page";
            let btnPath = "/login";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            score.facultyID = req.body.score.facultyID;
            score.courseID = req.body.score.courseID;
            score.ranking = req.body.score.ranking;
            score.desire = req.body.score.desire;
            score.notes = req.body.score.notes;

            console.log("Updating score");
            scoresDB.update(score);

            res.writeHead(302, { 'Location': `/scores/${score.id}` });
            res.end();
        }
    }

    // [TODO] dont think this will be used
    async delete(req, res) {
        let id = req.params.id;
        let score = await scoresDB.findScore(id);
        
        if (score == null) {
            let errormsg = "Could not find a score with an ID of " + id;
            let btnmsg = "Return to login page";
            let btnPath = "/login";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            scoresDB.remove(score);
            let scores = await scoresDB.allScores();
            res.render('score/scoreList', { scores: scores });
        }
    }

}

module.exports = ScoreController;
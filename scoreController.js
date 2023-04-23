const Score = require('./score');
const Key = require('./key');

const scoresDB = require('./scoresDB');

class ScoreController {

    async init(req, res) {
        scoresDB.initialize();
        console.log("initialized");
    }

    //search list of scores by user
    async searchByUser(req, res) {
        let id = req.params.id;

        let users = await scoresDB.allUsers();

        if (!id){ 
            id = users[0].userID;

            let i = 0;
            while (scoresDB.searchByUser(id) ==  null){
                id = users[i].userID;
                i++;
            }
        }

        let scores = await scoresDB.searchByUser(id);
        let courses = await scoresDB.allCourses();
        let rankKey = await scoresDB.getKey("ranking");
        let desKey = await scoresDB.getKey("desire");

        if (scores == null) {
            let errormsg = "There is no user with an ID of '" + id + "' or the requested user has no entered scores.";
            let btnmsg = "Return to course search";
            let btnPath = "/facultySearch/";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            res.render('admin/adminFaculty', { scores: scores, courses: courses, users: users, facultyID: id, rankKey: rankKey, desKey: desKey });
        }
    }

    async searchByCourse(req, res) {
        let id = req.params.id;
        
        if (!id){ 
            id = "CIS101";
        }

        let scores = await scoresDB.searchByCourse(id);
        let courses = await scoresDB.allCourses();
        let users = await scoresDB.allUsers();
        let rankKey = await scoresDB.getKey("ranking");
        let desKey = await scoresDB.getKey("desire");

        if (scores == null) {
            let errormsg = "There is no course with an ID of '" + id + "' or the requested course has no entered scores.";
            let btnmsg = "Return to course search";
            let btnPath = "/courseSearch/";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            res.render('admin/adminCourse', { courses: courses, scores: scores, users: users, courseID: id, rankKey: rankKey, desKey: desKey });
        }
    }

    async faculty(req, res) {
        let id = req.params.id;

        let courses = await scoresDB.allCourses();
        let user = await scoresDB.findUser(id);
        let scores = await scoresDB.scoresForUser(id);
        let scoreObj = new Score();
        let rankKey = await scoresDB.getKey("ranking");
        let desKey = await scoresDB.getKey("desire");

        if (user == null) {
            let errormsg = "There is no user with an ID of '" + id + "' or the requested user has no entered scores.";
            let btnmsg = "Return to login page";
            let btnPath = "/login";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            res.render('faculty/faculty', { courses: courses, user: user, scores: scores, scoreObj: scoreObj, rankKey: rankKey, desKey: desKey});
        }
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
            scoresDB.updateScore(score);

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
            scoresDB.removeScore(score);
            let scores = await scoresDB.allScores();
            res.render('score/scoreList', { scores: scores });
        }
    }

    async additionalFunctions(req, res) {
        res.render('admin/additionalFunct');
    }

    async getKeyForm(req, res) {
        let id = req.params.id;
        let key = await scoresDB.getKey(id);

        if (key == null) {
            let errormsg = "Could not find a key for " + id;
            let btnmsg = "Return to additional functions page";
            let btnPath = "/addFunc";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            res.render('admin/keyForm', { key: key });
        }
    }

    async updateKey(req, res) {
        let type = req.params.id;
        let key = await scoresDB.getKey(type);

        let testKey = new Key(req.body.key);
        if (!testKey.isValid()) {
            testKey.id = key.id;
            res.render('admin/keyForm', { key: testKey });
            return;
        }

        if (key == null) {
            let errormsg = "Could not find a key with an ID of " + id;
            let btnmsg = "Return to functions page";
            let btnPath = "/addFunc";
            res.render('notFoundError', { errormsg: errormsg, btnmsg: btnmsg, btnPath: btnPath });
        } else {
            key.type = req.body.key.type;
            key.upper = req.body.key.upper;
            key.desc = req.body.key.desc;

            console.log("Updating key");
            scoresDB.updateKey(key);

            res.writeHead(302, { 'Location': `/keys/${key.type}` });
            res.end();
        }
    }

}

module.exports = ScoreController;
//define score and validate inputs
let User = require('./user');
let Course = require('./course');

class Score {

    constructor(description){
        if (description) {
            this.id = description.id;
            this.courseID = description.courseID;
            this.facultyID = description.facultyID;
            this.ranking = description.ranking;
            this.desire = description.desire;
            this.notes = description.notes; 
            this.User = new User(description);
            this.Course = new Course(description);
        }
        
        this.errors = [];
    }
 
    isValid(){
        this.errors = [];

        var rankUpper = 3;
        var desUpper = 3;

        //if value < upper then it's ok, need to add upper and lower as variables
        if (!this.ranking || this.ranking < 0 || this.ranking > rankUpper){
            this.errors.push("Ranking is required and must be between 0 - 3.");
        }

        if (!this.desire || this.desire < 0 || this.desire > desUpper){
            this.errors.push("Desire is required and must be between 0 - 3.");
        }

        return this.errors.length <= 0;
    }

}

module.exports = Score;
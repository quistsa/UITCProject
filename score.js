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

    //[TODO] Add method to adjust upper and lower values
 
    isValid(){
        this.errors = [];
        //if value < upper && value > lower then it's ok, need to add upper and lower as variables
        

        return this.errors.length <= 0;
    }

}

module.exports = Score;
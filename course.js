//define course and validate inputs
class Course {

    constructor(description){
        if (description) {
            this.id = description.id;
            this.courseID = description.courseID;
            this.name = description.name;
        }
        
        this.errors = [];
    }

    isValid(){
        this.errors = [];

        if (!String(this.courseID).startsWith("CIS") || !String(this.courseID).indexOf(" ") == -1 || !String(this.courseID).substring(3).StringUtils.isNumeric())
            this.errors.push("Course ID must follow the format: CIS###");
        return this.errors.length <= 0;
    }

}

module.exports = Course;
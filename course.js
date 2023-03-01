//define course and validate inputs
class Course {

    constructor(description){
        if (description) {
            this.id = description.id;
            this.courseID = description.courseID.trim().toUpperCase();
            this.name = description.name.trim();
        }
        
        this.errors = [];
    }

    isValid(){
        this.errors = [];

        if (!this.courseID.startsWith("CIS") || !this.courseID.indexOf(" ") == 3 || !this.courseID.substring(4).StringUtils.isNumeric())
            this.errors.push("Course ID must follow the format CIS ###");
        return this.errors.length <= 0;
    }

}

module.exports = Course;
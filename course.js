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

        if (!String(this.courseID).startsWith("CIS")){
            this.errors.push("Course ID must follow the format: CIS### 1" + this.courseID);
        }

        if (!String(this.courseID).indexOf(" ") == -1){
            this.errors.push("Course ID must follow the format: CIS### 2");
        }
            
        if (!String(this.name)) {
            this.errors.push("Course must have a name");
        }

        return this.errors.length <= 0;
    }

}

module.exports = Course;
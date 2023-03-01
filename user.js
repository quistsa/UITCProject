//define user and validate inputs
class User {

    constructor(description){
        if (description) {
            this.id = description.id;
            this.fName = description.fName;
            this.lName = description.lName;
        }
        
        this.errors = [];
    }

    isValid(){
        this.errors = [];
        
        
        return this.errors.length <= 0;
    }

}

module.exports = User;
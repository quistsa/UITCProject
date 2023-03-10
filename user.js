//define user and validate inputs
class User {

    constructor(description){
        if (description) {
            this.id = description.id;
            this.userID = description.userID;
            this.fName = description.fName;
            this.lName = description.lName;
            this.guest = description.guest;
        }
        
        this.errors = [];
    }

    isValid(){
        this.errors = [];
        
        if (!this.fName || this.model.length <= 0){
            this.errors.push("User must have a first name");
        }

        if (!this.lName || this.model.length <= 0){
            this.errors.push("User must have a last name");
        }

        if(this.fName.length < 2){
            this.errors.push("User's first name must be at least 2 characters long");
        }

        if(this.lName.length < 2){
            this.errors.push("User's last name must be at least 2 characters long");
        }
        
        return this.errors.length <= 0;
    }

}

module.exports = User;
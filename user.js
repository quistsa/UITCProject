//define user and validate inputs
class User {

    constructor(description){
        if (description) {
            this.id = description.id;
            this.userID = description.userID;
            this.fName = description.fName;
            this.lName = description.lName;
            this.guest = description.guest;
            // should add boolean for admin later
        }
        
        this.errors = [];
    }

    isValid(){
        this.errors = [];
        
        if (!this.fName || String(this.fName).length <= 0){
            this.errors.push("User must have a first name");
        }

        if (!this.lName || String(this.lName).length <= 0){
            this.errors.push("User must have a last name");
        }

        if(String(this.fName).length < 2){
            this.errors.push("User's first name must be at least 2 characters long");
        }

        if(String(this.lName).length < 2){
            this.errors.push("User's last name must be at least 2 characters long");
        }
        
        return this.errors.length <= 0;
    }

}

module.exports = User;
//define user and validate inputs
class User {

    constructor(description){
        if (description) {
            this.id = description.id;
            this.userID = description.userID;
            this.fName = description.fName;
            this.lName = description.lName;
            this.guest = description.guest;
            this.admin = false; //set to description.admin if more admin logins are required in the future
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

        //error validation for if more admin users are added in the future
        if(this.admin && this.guest){
            this.errors.push("User cannot be an admin and a guest");
        }
        
        return this.errors.length <= 0;
    }

}

module.exports = User;
//define car and validate inputs
class User {

    constructor(description){
        if (description) {
            this.id = description.id;
            this.firstName = description.firstName;
            this.lastName = description.lastName;
        }
        
        this.errors = [];
    }

    isValid(){
        this.errors = [];
        
        
        return this.errors.length <= 0;
    }

}

module.exports = User;
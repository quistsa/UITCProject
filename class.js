//define class and validate inputs
class Class {

    constructor(description){
        if (description) {
            this.id = description.id;
            this.name = description.name;
        }
        
        this.errors = [];
    }

    isValid(){
        this.errors = [];

        
        return this.errors.length <= 0;
    }

}

module.exports = Class;
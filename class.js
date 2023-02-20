//define class and validate inputs
class Class {

    constructor(description){
        if (description) {
            this.id = description.id;
            this.className = description.className;
            this.classDesc = description.classDesc;
        }
        
        this.errors = [];
    }

    isValid(){
        this.errors = [];

        
        return this.errors.length <= 0;
    }

}

module.exports = Class;
//define user and validate inputs
class Key {

    constructor(description){
        if (description) {
            this.id = description.id;
            this.type = description.type;
            this.upper = description.upper;
            this.desc = description.desc;
        }
        
        this.errors = [];
    }

    isValid(){
        this.errors = [];
        
        if (!this.upper || String(this.upper).length <= 0){
            this.errors.push("Upper limit is a required field");
        }

        if (!Number.this.upper.isInteger()){
            this.errors.push("Upper limit must be an integer");
        }

        if (!this.desc || String(this.desc).length <= 0){
            this.errors.push("Key description is a required field");
        }
        
        return this.errors.length <= 0;
    }

}

module.exports = Key;
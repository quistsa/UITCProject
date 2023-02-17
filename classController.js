// used to perform operations on classes (create, edit, show)

const { test } = require('media-typer');
const Class = requrie('./class');
//const classDB = require('[./classDBfile]');

class classController{
    //return list of all classes
    async index(req, res) {
        let classes = await classDB.allClasses();
        res.render('classIndex', { classes: classes });
    }

    async show(req, res) {
        let id = req.params.id;
        let classObj = await classDB.findClass(id);

        if (!classObj) {
            res.send("Couldn't find a classObj with ID of " + id);
        } else {
            res.render('showClass', { classObj: classObj  });
        }
    }

    newClass(req, res) {
        res.render('newClass', {classObj: new Class()});
    }

    async create(req, res) {
        console.log("Creating new class");
        
        let newClass = await classDB.createClass(req.body.classObj);

        if (newClass.isValid()) {
            res.writeHead(302, { 'Location': `/classes/${newClass.id}`});
            res.end();
        } else {
            res.render('newClass', { classObj: newClass });
        }
    }

    async edit(req, res) {
        let id = req.params.id;
        let classObj = await classDB.findClass(id);

        if (!classObj) {
            res.send("Couldn't find a class with id " + id);
        } else {
            res.render('classEdit', { classObj: classObj });
        }
    }

    async update(req, res) {
        let id = req.params.id;
        let classObj = await classDB.findClass(id);

        let testClass = new Class(req.body.classObj);
        if (!testClass.isValid()) {
            testClass.id = classObj.id;
            res.render('classEdit', { classObj: testClass });
            return;
        }

        if (!classObj) {
            res.send("Could not find class with id of " + id);
        } else {
        //update variables for a class
        //[TODO] add variables to be changed when database is set

            console.log("Updating class");
            classDB.update(classObj);

            res.writeHead(302, { 'Location': `/classes/${classObj.id}` });
            res.end();
        }
    }

    async delete(req, res) {
        let id = req.params.id;
        let classObj = await classDB.findClass(id);
        

        if (!classObj) {
            res.send("Couldn't find a class with id " + id);
        } else {
            classDB.removeClass(classObj);
            let classes = await classDB.allClasss();
            res.render('classIndex', { classes: classes });
        }
    }

    async rawIndex(req, res) {
        let classes = await classDB.allClasses();
        res.send(classes);
    }
}
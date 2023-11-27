var express = require('express');
var router = express.Router();
var database = require('../database');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const { response } = require("express");

router.get("/", function(request, reponse, next){

    var query = "SELECT * FROM create-task ORDER BY id DESC";

    database.query(query, function(error, data){

        if(error)
        {
            throw error;
        }
        else
        {
            response.render('create-task', {title: 'Create Task Node.js', action:'list', createTask:data, message:request.flash('success')});
        }
    });
});

router.get("/add", function(request, response, next){

    response.render("create-task", {title: 'Create Task Data', action:'add'}
    );
});

router.post("/add-create-task", function(request, reponse, next){

    var title = request.body.title;
    var description = request.body.description;
    var due_date = request.body.due_date;
    var assigned_to = request.body.assigned_to;
    var employee_email = request.body.employee_email;
    var notes = request.body.notes;

    var query = `
    INSERT INTO tasks
    (title, description, due_date, assigned_to, employee_email, notes)
    VALUES ("${title}", "${description}", "${due_date}", "${assigned_to}", "${employee_email}", "${notes}")
    `;

    database.query(query, function(error, data){

        if(error)
        {
            throw error;
        }
        else
        {
            response.redirect("/create-task");
        }
    });

});

module.exports = router;

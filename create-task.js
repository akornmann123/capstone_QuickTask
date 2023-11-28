var express = require('express');
var path = require('path');
var session = require('express-session');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());





// Create Tasks
app.get('/create-task', function(req, res, next) {
    res.render('create-task', {title: 'create-task'});
});
app.post('/create-task', function(req, res, next) {
    var title = req.body.title;
    var description = req.body.description;
    var due_date = req.body.due_date;
    var assigned_to = req.body.assigned_to;
    var employee_email = req.body.employee_email;
    var notes = req.body.notes;

    var sql = `INSERT INTO tasks (title, description, due_date, assigned_to, employee_email, notes ) VALUES ('${title}', '${description}', '${due_date}', '${assigned_to}', '${employee_email}', '${notes}')`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Task Created");
        res.redirect('/');
    });
});

module.exports = app;

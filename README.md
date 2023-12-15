# capstone_QuickTask
QuickTask is an efficient and user friendly task management system to help encourage proper work flow. This project will be built utilizing the MEAN stack with Javascript and will have a database portion that is incorporated into it. Our main desire with this project is to assign a task to a specific employee and allow management the ability to monitor work efficiency and due dates of certain projects. There will be an option within each task to attach an employee and due date to it. Each employee should have the ability to view current and past tasks.

## INSTALLATION 
Our group will be utilzing javascript to create our project. The dependencies we decided upon are Postgres, Node.js, Express, and Angular. Postgres will be our database allowing us to store and manage data. Node.js is the runtime environment we are using allowing us to create a server side web application. We are using Express as our node.js framework, Express will help manage our routes for things like tasks and employees. We will use Angular to build the user interface, it will help with the structure of our application.

## LOCAL INSTALLATION
- Download and install GitBash from: https://git-scm.com/downloads
- Download and install PostgreSQL from: https://www.postgresql.org/download/
- Open GitBash and navigate to the directory where you want to clone the repository
- Run the following command: git clone https://github.com/akornmann123/capstone_QuickTask.git
- install Node.js dependencies: npm install
- Open PostgreSQL and create a new database with the contents from schema.sql
- Create a file named .env in the root directory
- Add the following line to the .env file: DATABASE_URL=postgres://username:password@localhost/database-name
- In GitBash run the command: npm start
- git Open a web browser and go to: localhost:3001

## FEATURES
We created a create-task.js page we are allowing users to seamlessly create new tasks by providing the essential details. The task-list.js page displays a comprehensive list of tasks. This centralized view offers a quick overview of ongoing tasks and their current statuses. When we created the view-task.js we had in mind creating a page that provides a detailed view of a specific task. The user can access this view by clicking on the "View" action from the task list. The stylesheet that was added has very basic styles that we will update as we get further along in our project, it was created as a base style for now. We also added "create account" page. If an employee or manager wants to manage their tasks, they would need to create an account. We made a form with values that a normal account would have for them to enter. We also made it so the user is able to view their completed tasks. When they bring up this page, they will be able to see what tasks they have already accomplished.

We added the capability to allow the user to add a note in a task while viewing the task list. This will update the notes section of the tasks table. This will produce better communication and a clearer view on what is needed to complete the task. The view task page now has a button to edit the task. The edit task page will pull all of the data into editable textboxes / drop-down menus. Pressing the update will save the changes and redirect to the task list page. The Assigned To drop-down is using a query to get a list of all user accounts to pick from. We made a create task page and form and are currently in the process of trying to get form data to submit to the data base. This will allow users, specifically managers, to add tasks for their employees.

We added a feature that hashes users passwords, allowing them to securely store their password. We also configured the /create-account in the index.js to allow users account creation to be added to the database. We also created /accounts to allow users to see a list of accounts. We updated the styles.css sheet, added error handling to create account route, updated path to style sheet. We also added more employees to the database so the manager can select who they want to complete the task and they are also allowed to change that in edit task. We added due dates to the task list and completed tasks that can be changed if needed in edit task. We made it so when you create an account it logs in our database and can be used to log in. Passwords will be hashed.

We implemented a View My Tasks page that will show a list and information about all tasks that are assigned to the currently logged in user. We made the create task functional by adding in the correct tags and fixing slight syntax errors. We added general CSS to all web pages which includes adding colored backgrounds, changing text color, hover over text color, centered forms and text, etc. We added div tags to pages to allow me to make individual changes to each page which included: White box border around information, widened the blue border, updated the nav margins so it wasn't so close to the content and adjusted spacing for better readability.

[QuickTask.com](https://quicktask-9692.onrender.com)
akornmann@student.cvtc.edu
Jrudesill@student.cvtc.edu



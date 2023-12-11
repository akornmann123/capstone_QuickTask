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

[QuickTask.com](https://quicktask-9692.onrender.com)
akornmann@student.cvtc.edu

DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS userAccounts;

CREATE TABLE userAccounts (
    id SERIAL PRIMARY KEY,
    fName TEXT NOT NULL,
    lName TEXT NOT NULL,
    job TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

-- task table --
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    assigned_to TEXT,
    employee_email TEXT,
    completed BOOLEAN NOT NULL DEFAULT false,
    user_id INTEGER REFERENCES userAccounts(id),
    notes TEXT,
    status TEXT
);

INSERT INTO userAccounts (fName, lName, job, username, password) VALUES ('Missy', 'Rambo', 'Employee', 'mRambo', 'secure');
INSERT INTO userAccounts (fName, lName, job, username, password) VALUES ('Mister', 'Rodger', 'Employee', 'username', 'password');
INSERT INTO userAccounts (fName, lName, job, username, password) VALUES ('John', 'Johnson', 'Employee', 'username', 'password');
INSERT INTO userAccounts (fName, lName, job, username, password) VALUES ('Kelly', 'Morrison', 'Employee', 'username', 'password');
INSERT INTO userAccounts (fName, lName, job, username, password) VALUES ('Betty', 'Crocker', 'Employee', 'username', 'password');
INSERT INTO userAccounts (fName, lName, job, username, password) VALUES ('Mike', 'Wasoski', 'Employee', 'username', 'password');
INSERT INTO userAccounts (fName, lName, job, username, password) VALUES ('Billy', 'Jones', 'Employee', 'username', 'password');
INSERT INTO userAccounts (fName, lName, job, username, password) VALUES ('Chrisopher', 'Robin', 'Employee', 'username', 'password');
INSERT INTO userAccounts (fName, lName, job, username, password) VALUES ('Sally', 'Corrin', 'Manager', 'username', 'password');
INSERT INTO userAccounts (fName, lName, job, username, password) VALUES ('admin', 'admin', 'Manager', 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');

-- insert tasks
INSERT INTO tasks (title, description, completed, due_date, user_id, notes, status) VALUES
('Test Task 1 Incomplete', 'Test Description 1 Incomplete', false, '12/27/23', 1, 'test note 1', 'Incomplete'),
('Test Task 2 Completed', 'Test Description 2 Completed', true, '02/13/24', 1, 'test completed 2', 'Completed'),
('Test Task 3 Incomplete', 'Test Description 3 Incomplete', false, '05/25/24', 2, 'test incomplete 3', 'Started'),
('Test Task 4 Completed', 'Test Description 4 Completed', true, '08/04/24', 2, NULL , 'Completed');

DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS userAccounts;

CREATE TABLE userAccounts (
    id SERIAL PRIMARY KEY,
    fName TEXT NOT NULL,
    lName TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

-- task table --
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    assigned_to TEXT,
    employee_email TEXT,
    completed BOOLEAN NOT NULL DEFAULT false,
    user_id INTEGER REFERENCES userAccounts(id),
    notes TEXT,
    status TEXT
);

INSERT INTO userAccounts (fName, lName, username, password) VALUES ('Missy', 'Rambo', 'mRambo', 'secure');
INSERT INTO userAccounts (fName, lName, username, password) VALUES ('Mister', 'Rodger', 'username', 'password');

-- insert tasks
INSERT INTO tasks (title, description, completed, user_id, notes, status) VALUES
('Test Task 1 Incomplete', 'Test Description 1 Incomplete', false, 1, 'test note 1', 'Incomplete'),
('Test Task 2 Completed', 'Test Description 2 Completed', true, 1, 'test completed 2', 'Completed'),
('Test Task 3 Incomplete', 'Test Description 3 Incomplete', false, 2, 'test incomplete 3', 'Started'),
('Test Task 4 Completed', 'Test Description 4 Completed', true, 2, NULL , 'Completed');
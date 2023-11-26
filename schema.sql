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
    completed BOOLEAN NOT NULL DEFAULT false,
    user_id INTEGER REFERENCES userAccounts(id),
    notes TEXT
);

INSERT INTO userAccounts (fName, lName, username, password) VALUES ('Missy', 'Rambo', 'mRambo', 'secure');
INSERT INTO userAccounts (fName, lName, username, password) VALUES ('Mister', 'Rodger', 'username', 'password');

-- insert tasks
INSERT INTO tasks (title, description, completed, user_id) VALUES
('Test Task 1 Incomplete', 'Test Description 1 Incomplete', false, 1),
('Test Task 1 Completed', 'Test Description 1 Completed', true, 1),
('Test Task 2 Incomplete', 'Test Description 2 Incomplete', false, 2),
('Test Task 2 Completed', 'Test Description 2 Completed', true, 2);
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
    user_id INTEGER REFERENCES userAccounts(id)
);

INSERT INTO userAccounts (fName, lName, username, password) VALUES ('Missy', 'Rambo', 'mRambo', 'secure');
INSERT INTO userAccounts (fName, lName, username, password) VALUES ('Mister', 'Rodger', 'username', 'password');

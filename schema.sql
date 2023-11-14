DROP TABLE IF EXISTS userAccounts;

CREATE TABLE userAccounts (
    id SERIAL PRIMARY KEY,
    fName TEXT NOT NULL,
    lName TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO userAccounts (fName, lName, username, password) VALUES ('Missy', 'Rambo', 'mRambo', 'secure');
INSERT INTO userAccounts (fName, lName, username, password) VALUES ('Mister', 'Rodger', 'username', 'password');

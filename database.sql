DROP DATABASE IF EXISTS pokeindex;
CREATE DATABASE pokeindex;

USE pokeindex;
CREATE TABLE accounts
(
    user_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);
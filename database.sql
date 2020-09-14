DROP DATABASE IF EXISTS pokeindex;
CREATE DATABASE pokeindex;

USE pokeindex;
CREATE TABLE accounts
(
    user_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);
CREATE TABLE comments
(
    comment_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    content VARCHAR(200) NOT NULL,
    pokemon_id_attach INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES accounts(user_id)
);
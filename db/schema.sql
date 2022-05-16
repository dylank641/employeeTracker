DROP DATABASE IF EXISTS v;
CREATE DATABASE goldenLeaf_db;

USE goldenLeaf_db;

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(36) NOT NULL
);

CREATE TABLE roles (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(36) NOT NULL,
    salary DECIMAL (10, 2),
    department_id INTEGER,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    last_name VARCHAR (24) NOT NULL,
    first_name VARCHAR (24) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER DEFAULT NULL REFERENCES employee(id),
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
);
DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary INT(10) NOT NULL,
    department_id INT NOT NULL REFERENCES department(id),
    PRIMARY KEY(id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL REFERENCES role(id),
    manager_id INT NULL REFERENCES employee(id),
    PRIMARY KEY(id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Mike', 'Chan', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Ashley', 'Rodriguez', 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Kevin', 'Tupik', 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Malia', 'Brown', 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Sarah', 'Lourd', 6, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Tom', 'Allen', 7, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Christian', 'Eckenrode', 3, 2);


INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Person', 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Lead Engineer', 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Accountant', 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ('Legal Team Lead', 250000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ('Lawyer', 190000, 4);

INSERT INTO department (name)
VALUES ('Sales');
INSERT INTO department (name)
VALUES ('Engineering');
INSERT INTO department (name)
VALUES ('Finance');
INSERT INTO department (name)
VALUES ('Legal');


SELECT * FROM employee;
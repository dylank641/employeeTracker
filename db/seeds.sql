SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employees;

INSERT INTO department
(name)
VALUES ('Marketing'),('Customer-Service'),('Financial'),('Packaging');

INSERT INTO roles
        (title, salary, department_id)
        VALUES
        ('Ad-Specialist', 80000, 100),
        ('Customer-Service-Rep', 45000, 200),
        ('Accountant', 70000, 300),
        ('Packaging Rep', 35000, 400);

INSERT INTO employees
        (first_name, last_name, role_id, manager_id)
        VALUES
         ('Cesar', 'Perez', 301, 487),
         ('Daniel', 'Branca', 405, 628),
         ('Pedro', 'Allday', 108, 348),
         ('Jose', 'Medina', 265, 135);
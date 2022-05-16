INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Finance"),
       ("Marketing"),
       ("Growers");

INSERT INTO roles (title, salary, department_id)
VALUES ("Cashier", 15000.00, 1),
       ("Accountant", 20000.00, 2),
       ("Lead Marketing Director", 25000.00, 3),
       ("Grassroots Marketer", 22000.00, 3),
       ("Tomato Grower", 18000.00, 4),
       ("Cucumber Grower", 17500.00, 4),
       ("Spinach Grower", 16750.00, 4);

INSERT INTO employee (last_name, first_name, role_id, manager_id)
VALUES ("Smith", "John", 1, NULL),
       ("Jones", "Amy", 2, NULL),
       ("Avery", "Lucas", 3, NULL ),
       ("Henderson", "Mel", 4, 3),
       ("West", "Ron", 5, NULL),
       ("Henry", "Adam", 5, 5),
       ("Voight", "Wanda", 6, 5),
       ("Cobb", "Mary", 7, 5);
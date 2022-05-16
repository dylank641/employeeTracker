
INSERT INTO department (department_name)
VALUES ("SEO"),
       ("Finance"),
       ("Shipping"),
       ("CustomerService");

INSERT INTO roles (title, salary, department_id)
VALUES ("CSA", 45000.00, 1),
       ("Accountant", 30000.00, 2),
       ("SEO Supervisor", 25000.00, 3),
       ("Marketer", 62000.00, 3),
       ("Inventory Specialist", 14000.00, 4),
       ("Shipping Supervisor", 18000.00, 4),
       ("Shipping Ast.", 20750.00, 4);

INSERT INTO employee (last_name, first_name, role_id, manager_id)
VALUES ("Dylan", "Killelea", 1, NULL),
       ("Daniel", "branca", 2, NULL),
       ("Cesar", "Perez", 3, NULL ),
       ("Gibson", "Mel", 4, 3),
       ("Kanye", "West", 5, NULL),
       ("Tim", "Dillon", 5, 5),
       ("Gang", "Allday", 6, 5),
       ("Corn", "Mayo", 7, 5);
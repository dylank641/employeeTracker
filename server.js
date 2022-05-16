const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

//connect to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'thunder64',
    database: 'goldenLeaf_db'
}, );

// server connect
db.connect(function (err) {
    if (err) throw err;
    startNav();

})

// navigation
function startNav() {
    inquirer
        .prompt({
            name: 'nav',
            type: 'list',
            message: 'Golden Leaf Database *** Select an option.',
            choices: [
                'View all Departments',
                'View all Roles',
                'View all Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Exit'
            ],
        }).then(answers => {
            switch ('Answer: ', answers.nav) {
                case 'View all Departments':
                    seeDepart();
                    break;
                case 'View all Roles':
                    seeRoles();
                    break;
                case 'View all Employees':
                    seeEm();
                    break;
                case 'Add a Department':
                    addDepart();
                    break;
                case 'Add a Role':
                    addRole();
                    break;
                case 'Add an Employee':
                    addEm();
                    break;
                case 'Update an Employee Role':
                    updateEmRole();
                    break;
                case 'Exit':
                    quit();
                    break;
            }
        })
};

//view departments
function seeDepart() {
    db.query("SELECT * FROM department",
        function (err, res) {
            if (err) throw err;
            console.table('Golden Leaf Departments: ', res);
            startNav();
        })
};

//view rolles
function seeRoles() {
    db.query("SELECT * FROM roles",
        function (err, res) {
            if (err) throw err;
            console.table('Golden Leaf Roles: ', res);
            startNav();
        })
};

//view employees
function seeEm() {
    db.query("SELECT * FROM employee",
        function (err, res) {
            if (err) throw err;
            console.table('Golden Leaf Employees: ', res);
            startNav();
        })
};

//add department
function addDepart() {
    inquirer
        .prompt([{
            name: "addDepart",
            type: "input",
            message: "What is the name of the new department?"
        }]).then(function (answer) {
            db.query(`INSERT INTO department (department_name) VALUES ('${answer.addDepart}')`,
                (err, res) => {
                    if (err) throw err;
                    console.log(answer.addDepart + " was added to the department list.");
                    startNav();
                })
        })
};

//add new role
function addRole() {
    inquirer
        .prompt([{
                name: "addRole",
                type: "input",
                message: "What is the new role called?"
            },
            {
                name: "addSal",
                type: "input",
                message: "What is the yearly salary for this role?"
            },
            {
                name: "addDept",
                type: "input",
                message: "What is the department ID for this role?"
            }
        ]).then(function (answer) {
            db.query(`INSERT INTO roles (title, salary, department_id) Values ('${answer.addRole}', '${answer.addSal}', '${answer.addDept}')`,
                (err, res) => {
                    if (err) throw err;
                    console.log(answer.addRole + " was added to the list of job roles, and has a yearly salary of " + answer.addSal + ".");
                    startNav();
                })
        })
};

//add emplyoyee
function addEm() {
    inquirer
        .prompt([{
                name: 'firstName',
                type: 'input',
                message: "What is the new employees first name?"
            },
            {
                name: 'lastName',
                type: 'input',
                message: "What is the new employees last name?"
            },
            {
                name: 'roleId',
                type: 'input',
                message: "What is the employee's role? 1. SEO 2. Finance 3. Shipping 4. CustomerService",
                choices: ["1", "2", "3", "4"]
            },
            {
                name: 'managerId',
                type: 'input',
                message: "What is the manager role id? 1. SEO Manager 2. Finance Manager 3. Shipping Manager 4. CustomerService Manager",
                choices: ["1", "2", "3", "4"]
            },
        ]).then(function (answer) {
            db.query(`INSERT INTO employee (last_name, first_name, role_id, manager_id) VALUES ('${answer.firstName}', '${answer.lastName}', '${answer.roleId}', '${answer.managerId}')`,
                (err, res) => {
                    if (err) throw err;
                    console.log(answer.firstName + " " + answer.lastName + " has been added to the list of empoloyee's.");
                    startNav();
                })
        })
};

//update employee role
function updateEmRole() {
    inquirer
        .prompt([{
                name: "changeRole",
                type: "input",
                message: "Please provide the ID of the employee you are trying to update.",
            },
            {
                name: "newRole",
                type: "input",
                message: "What is the employee's new role? 1. SEO 2. Finance 3. Shipping 4. CustomerService",
                choices: ["1", "2", "3", "4"]
            }
        ]).then(function (answer) {
            const changeRole = answer.changeRole;
            const newRole = answer.newRole;
            const roleUpdate = `UPDATE employee SET role_id = "${newRole}" WHERE id = "${changeRole}"`;
            db.query(roleUpdate, function (err, res) {
                if (err) throw err;
                console.table(answer);
                startNav();
            })
        })
};


function quit() {
    console.log("Exiting Golden Leaf Employee Database");
    db.end();
};

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
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ],
        }).then(answers => {
            switch ('Answer: ', answers.nav) {
                case 'View all departments':
                    seeDepart();
                    break;
                case 'View all roles':
                    seeRoles();
                    break;
                case 'View all employees':
                    seeEm();
                    break;
                case 'Add a department':
                    addDepart();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEm();
                    break;
                case 'Update an employee role':
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


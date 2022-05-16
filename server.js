const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// connect to the database
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

// prompt for user input
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
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    exitTrack();
                    break;
            }
        })
};


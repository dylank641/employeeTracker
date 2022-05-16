const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
require("dotenv").config();

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL username,
    user: process.env.DB_US,
    // Your MySQL password
    password: process.env.DB_PW,
    database: "employee",
  },

  console.log("Connected to the employee database.")
);

// Ascii art from: https://www.asciiart.eu/food-and-drinks/coffee-and-tea
function welcome() {
  console.log(`
      ;)( ;
    :----:         My Employee SQL:
   C|====|    Employee Management System
    |    |     
     ----
`);

  nav();
}

// navigation menu
function nav() {
  inquirer
    .prompt({
      type: "list",
      name: "navigation",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "View Employees by Manager",
        "View Employees by Department",
        "View total budget of a Department",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee Role",
        "Update an Employee Manager",
        "Delete Departments",
        "Delete Roles",
        "Delete Employees",
        "Exit",
      ],
    })
    .then((answer) => {
      nextPrompt = answer.navigation;
      if (nextPrompt === "View All Departments") {
        viewDepartments();
      } else if (nextPrompt === "View All Roles") {
        viewRoles();
      } else if (nextPrompt === "View All Employees") {
        viewEmployees();
      } else if (nextPrompt === "View Employees by Manager") {
        viewEmployeesByManager();
      } else if (nextPrompt === "View Employees by Department") {
        viewEmployeesByDepartment();
      } else if (nextPrompt === "View total budget of a Department") {
        viewBudget();
      } else if (nextPrompt === "Add a Department") {
        addDepartment();
      } else if (nextPrompt === "Add a Role") {
        addRole();
      } else if (nextPrompt === "Add an Employee") {
        addEmployee();
      } else if (nextPrompt === "Update an Employee Role") {
        updateEmployeeRole();
      } else if (nextPrompt === "Update an Employee Manager") {
        updateEmployeeManager();
      } else if (nextPrompt === "Delete Departments") {
        deleteDepartment();
      } else if (nextPrompt === "Delete Roles") {
        deleteRole();
      } else if (nextPrompt === "Delete Employees") {
        deleteEmployee();
      } else {
        goodbye();
      }
    });
}

// Display departments from the database
function viewDepartments() {
  console.log(`
Departments Table
  `);

  db.query(`SELECT * FROM department`, function (err, result, fields) {
    if (err) throw err;
    console.table(result);

    nav();
  });
}

// Display roles from the database
function viewRoles() {
  console.log(`
Roles Table
  `);

  db.query(
    `SELECT roles.id, roles.title AS Title, roles.salary AS Salary, department.department_name AS Department
    FROM roles
    INNER JOIN department ON roles.department_id = department.id`,
    function (err, result, fields) {
      if (err) throw err;
      console.table(result);

      nav();
    }
  );
}

// Display employees from the database
function viewEmployees() {
  console.log(`
Employees Table
  `);

  db.query(
    `SELECT employee.id, employee.first_name AS First, employee.last_name AS Last, roles.title AS Role, department.department_name AS Department, roles.salary AS Salary, CONCAT(manager.last_name, ", ", manager.first_name) AS Manager
    FROM employee
        LEFT JOIN roles 
            ON employee.role_id = roles.id
        LEFT JOIN department 
            ON roles.department_id = department.id
        LEFT JOIN employee AS manager ON manager.id = employee.manager_id`,
    function (err, result, fields) {
      if (err) throw err;
      console.table(result);

      nav();
    }
  );
}

// Display employees by manager
function viewEmployeesByManager() {
  console.log(`
Employees by Manager Table
  `);

  db.query(
    `SELECT employee.id, employee.first_name AS First, employee.last_name AS Last, CONCAT(manager.last_name, ", ", manager.first_name) AS Manager
    FROM employee
    LEFT JOIN employee AS manager ON manager.id = employee.manager_id
    ORDER BY Manager DESC`,
    function (err, result, fields) {
      if (err) throw err;
      console.table(result);

      nav();
    }
  );
}

// Display employees by department
function viewEmployeesByDepartment() {
  console.log(`
Employees by Department Table
  `);

  db.query(
    `SELECT employee.id, employee.first_name AS First, employee.last_name AS Last, department.department_name AS Department
    FROM employee
    LEFT JOIN roles 
            ON employee.role_id = roles.id
    LEFT JOIN department 
            ON roles.department_id = department.id
    ORDER BY Department DESC;`,
    function (err, result, fields) {
      if (err) throw err;
      console.table(result);

      nav();
    }
  );
}

// Display Budget by Department
function viewBudget() {
  console.log(`
Department Budget Table
  `);

  db.query(
    `SELECT department.department_name AS Department, SUM(roles.salary) AS Budget
    FROM employee
    INNER JOIN roles ON employee.role_id = roles.id
    INNER JOIN department ON roles.department_id = department.id
    GROUP BY department.department_name;`,
    function (err, result, fields) {
      if (err) throw err;
      console.table(result);

      nav();
    }
  );
}

// Add a department to the database
function addDepartment() {
  console.log("Add Department here");
  inquirer
    .prompt({
      type: "input",
      name: "departmentInput",
      message: "Please enter the new department name.",
      validate: (departmentInput) => {
        if (!departmentInput) {
          console.log("Ack! Please enter the department name-");
          return false;
        } else {
          return true;
        }
      },
    })
    .then((answer) => {
      newDept = answer.departmentInput;

      db.query(
        `INSERT INTO department (department_name)
        VALUES ("${newDept}")`,
        function (err, result, fields) {
          if (err) throw err;
          console.log(" Department Added! ");

          // return to navigation menu
          nav();
        }
      );
    });
}

// Add a role to the database
function addRole() {
  // variable for available departments
  const availableDepartments = [];

  // dabatase query to recieve department name and id
  db.query(`SELECT * FROM department`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var departments = dbData.id + ": " + dbData.department_name;
      availableDepartments.push(departments);
    });
  });

  inquirer
    .prompt([
      {
        type: "input",
        name: "titleInput",
        message: "Please enter the new role name.",
        validate: (titleInput) => {
          if (!titleInput) {
            console.log("Ack! Please enter the role name-");
            return false;
          } else {
            return true;
          }
        },
      },
      {
        type: "input",
        name: "salaryInput",
        message:
          "Please enter a salary for the new role using the format: XXXXX.XX",
        validate: (salaryInput) => {
          if (!salaryInput) {
            console.log("Ack! Please enter a salary for the new role-");
            return false;
          } else {
            return true;
          }
        },
      },
      {
        type: "list",
        name: "departmentInput",
        message: "Please choose which department this role belongs to.",
        choices: availableDepartments,
      },
    ])
    .then((answers) => {
      let title = answers.titleInput;
      let salary = answers.salaryInput;
      let deptArray = answers.departmentInput.split("");
      let departmentId = deptArray[0];

      // query to add a new role to the database
      db.query(
        `INSERT INTO roles (title, salary, department_id)
        VALUES ("${title}", ${salary}, ${departmentId})`,
        function (err, result, fields) {
          if (err) throw err;
          console.log(" Role Added! ");

          // return to navigation menu
          nav();
        }
      );
    });
}

// Add an employee to the database
function addEmployee() {
  // variables for roles and managers
  const availableRoles = [];
  const availableManagers = [];

  // dabatase query to recieve role title and id
  db.query(`SELECT * FROM roles`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var role = dbData.id + ": " + dbData.title;
      availableRoles.push(role);
    });
  });

  // dabatase query to recieve employee name and id
  db.query(`SELECT * FROM employee`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var employees = dbData.id + ": " + dbData.first_name + dbData.last_name;
      availableManagers.push(employees);
    });
    availableManagers.push("null");
  });

  inquirer
    .prompt([
      {
        type: "input",
        name: "firstNameInput",
        message: "Please enter the employee's first name.",
        validate: (firstNameInput) => {
          if (!firstNameInput) {
            console.log("Ack! Please enter the employee's first name-");
            return false;
          } else {
            return true;
          }
        },
      },
      {
        type: "input",
        name: "lastNameInput",
        message: "Please enter the employee's last name.",
        validate: (lastNameInput) => {
          if (!lastNameInput) {
            console.log("Ack! Please enter the employee's last name-");
            return false;
          } else {
            return true;
          }
        },
      },
      {
        type: "list",
        name: "roleInput",
        message: "Please choose a role for this employee.",
        choices: availableRoles,
      },
      {
        type: "list",
        name: "managerInput",
        message: "Please choose the employee's manager.",
        choices: availableManagers,
      },
    ])
    .then((answers) => {
      let firstName = answers.firstNameInput;
      let lastName = answers.lastNameInput;
      let roleArray = answers.roleInput.split("");
      let roleId = roleArray[0];

      // get the manager id, or if null- set to null
      let managerId = [];
      if (answers.managerInput === "null") {
        managerId.push("null");
      } else {
        let managerArray = answers.managerInput.split("");
        managerId.push(managerArray[0]);
      }

      // query to add a new employee to the database
      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${firstName}", "${lastName}", ${roleId}, ${managerId});`,
        function (err, result, fields) {
          if (err) throw err;
          console.log(" Employee Added! ");

          // return to navigation menu
          nav();
        }
      );
    });
}

// Update an employee's role in the database
function updateEmployeeRole() {
  // variables for roles and managers
  const availableRoles = [];
  const availableEmployees = [];

  // first, perform a dabatase query to recieve role title and id
  db.query(`SELECT * FROM roles`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var role = dbData.id + ": " + dbData.title;
      availableRoles.push(role);
    });
  });

  // first, perform a dabatase query to recieve employee name and id
  db.query(`SELECT * FROM employee`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var employees = dbData.id + ": " + dbData.first_name + dbData.last_name;
      availableEmployees.push(employees);
    });
    selectNewRole();
  });

  // then, move to prompts
  function selectNewRole() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeChoice",
          message: "Which employee would you like to update?",
          choices: availableEmployees,
        },
        {
          type: "list",
          name: "roleChoice",
          message: "Please select their new role",
          choices: availableRoles,
        },
      ])
      .then((answers) => {
        // turn the answer into an array
        roleArray = answers.roleChoice.split("");
        employeeArray = answers.employeeChoice.split("");
        // get the i.d.
        let roleId = roleArray[0];
        let employeeId = employeeArray[0];

        // query to update an employee's role in the database
        db.query(
          `UPDATE employee 
          SET role_id = ${roleId} 
          WHERE employee.id = ${employeeId}`,
          function (err, result, fields) {
            if (err) throw err;
            console.log(" Employee's Role Updated! ");

            // return to navigation menu
            nav();
          }
        );
      });
  }
}

// Update an employee's manager in the database
function updateEmployeeManager() {
  // variables for roles and managers
  const availableManagers = [];
  const availableEmployees = [];

  // first, perform a dabatase query to recieve employees name and id
  db.query(`SELECT * FROM employee`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var employees = dbData.id + ": " + dbData.first_name + dbData.last_name;
      availableEmployees.push(employees);
      availableManagers.push(employees);
    });
    availableManagers.push("null");
    selectNewManager();
  });

  // then, move to prompts
  function selectNewManager() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeChoice",
          message: "Which employee would you like to update?",
          choices: availableEmployees,
        },
        {
          type: "list",
          name: "managerChoice",
          message: "Please select their new manager",
          choices: availableManagers,
        },
      ])
      .then((answers) => {
        // turn the answer into an array
        employeeArray = answers.employeeChoice.split("");
        // get the i.d.
        let employeeId = employeeArray[0];

        // get the manager id, or if null- set to null
        let managerId = [];
        if (answers.managerChoice === "null") {
          managerId.push("null");
        } else {
          let managerArray = answers.managerChoice.split("");
          managerId.push(managerArray[0]);
        }

        // query to update an employee's role in the database
        db.query(
          `UPDATE employee 
          SET manager_id = ${managerId} 
          WHERE employee.id = ${employeeId}`,
          function (err, result, fields) {
            if (err) throw err;
            console.log(" Employee's Manager Updated! ");

            // return to navigation menu
            nav();
          }
        );
      });
  }
}

// Delete a department from the database
function deleteDepartment() {
  // variable for available departments
  const availableDepartments = [];

  // first, perform a dabatase query to recieve department name and id
  db.query(`SELECT * FROM department`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var departments = dbData.id + ": " + dbData.department_name;
      availableDepartments.push(departments);
    });

    // then, move to inquirer prompts
    selectDepartment();
  });

  function selectDepartment() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentChoice",
          message: "Please choose a department to delete.",
          choices: availableDepartments,
        },
      ])
      .then((answer) => {
        // turn the answer into an array
        deptArray = answer.departmentChoice.split("");
        // get the i.d.
        let departmentId = deptArray[0];

        // query to remove the department from the database
        db.query(
          `DELETE FROM department
          WHERE department.id = ${departmentId}`,
          function (err, result, fields) {
            if (err) throw err;
            console.log(" Department Deleted! ");
            // return to navigation menu
            nav();
          }
        );
      });
  }
}

// Delete a role from the database
function deleteRole() {
  // variable for role choice
  const availableRoles = [];

  // first, perform a dabatase query to recieve role title and id
  db.query(`SELECT * FROM roles`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var role = dbData.id + ": " + dbData.title;
      availableRoles.push(role);
    });
    selectRole();
  });

  // then, move to prompts
  function selectRole() {
    inquirer
      .prompt({
        type: "list",
        name: "roleChoice",
        message: "Please choose a role to delete.",
        choices: availableRoles,
      })
      .then((answer) => {
        // turn the answer into an array
        roleArray = answer.roleChoice.split("");
        // get the i.d.
        let roleId = roleArray[0];

        // query to remove a role from the database
        db.query(
          `DELETE FROM roles
          WHERE roles.id = ${roleId}`,
          function (err, result, fields) {
            if (err) throw err;
            console.log(" Role Deleted! ");

            // return to navigation menu
            nav();
          }
        );
      });
  }
}

// Delete an employee from the database
function deleteEmployee() {
  // variable for employee choice
  const availableEmployees = [];

  // first, perform a dabatase query to recieve employee name and id
  db.query(`SELECT * FROM employee`, function (err, result, fields) {
    if (err) throw err;
    result.forEach((dbData) => {
      var employees = dbData.id + ": " + dbData.first_name + dbData.last_name;
      availableEmployees.push(employees);
    });
    selectEmployee();
  });

  // then, move to prompts
  function selectEmployee() {
    inquirer
      .prompt({
        type: "list",
        name: "employeeChoice",
        message: "Please choose an employee to delete.",
        choices: availableEmployees,
      })
      .then((answer) => {
        // turn the answer into an array
        employeeArray = answer.employeeChoice.split("");
        // get the i.d.
        let employeeId = employeeArray[0];

        // query to remove an employee from the database
        db.query(
          `DELETE FROM employee 
          WHERE employee.id = ${employeeId};`,
          function (err, result, fields) {
            if (err) throw err;
            console.log(" Employee Deleted! ");

            // return to navigation menu
            nav();
          }
        );
      });
  }
}

// Exit the application
// Ascii art from: https://www.asciiart.eu/plants/cactus
function goodbye() {
  console.log(`
    *-.
    |  |
,.  |  |
| |_|  | ,.     Thank you for using
'---.  |_| |      My Employee SQL
    |  .--'
    |  |
    |  | 
`);
}

welcome();
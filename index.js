// Assigning dependancies 
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    // Insert your password here. It may be different depending on your MySQL credentials.
    password: '123',
    database: 'employees_db'
  },
  console.log(`Connected to the books_db database.`)
);

// Title screen and first prompt
console.log(`
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

████████╗███████╗████████╗ █████╗ 
╚══██╔══╝██╔════╝╚══██╔══╝██╔══██╗
   ██║   █████╗     ██║   ███████║
   ██║   ██╔══╝     ██║   ██╔══██║
   ██║   ███████╗   ██║   ██║  ██║
   ╚═╝   ╚══════╝   ╚═╝   ╚═╝  ╚═╝
    The Employee-Tracking App
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
`);

let initPrompt = () => {
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "action",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee",
        "Exit"
      ],
    },
  ])
    // Switch statement to call a function depending on what the user chooses
    .then((answer) => {
      switch (answer.action) {
        case "View All Departments":
          viewAllDepartments();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee":
          updateEmployee();
          break;
        // If the user wishes to exit the application
        case "Exit":
          db.end();
          break;
      }
    });
}

// Function for viewing a formatted table showing department names and department ids
let viewAllDepartments = () => {
  db.query(`SELECT department.name AS "Department", department.id AS "Department Id" FROM department;`, (err, result) => {
    if (err) throw err;
    console.table(result);
    initPrompt();
  });
}

// Function for viewing a table showing roles with job title, role id, the department that role belongs to, and the salary for that role
let viewAllRoles = () => {
  db.query(`SELECT role.title AS "Role", role.id AS "Role Id", department.name AS "Department", role.salary AS "Salary ($)" FROM role JOIN department ON role.department_id = department.id;`, (err, result) => {
    if (err) throw err;
    console.table(result);
    initPrompt();
  });
}

// Function for viewing a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
let viewAllEmployees = () => {
  db.query(`SELECT employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title as "Job Title", department.name AS "Department", role.salary AS "Salary ($)", CONCAT(e.first_name, ' ' , e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department ON department.id = role.department_id LEFT JOIN employee e ON employee.manager_id = e.id;`, (err, result) => {
    if (err) throw err;
    console.table(result);
    initPrompt();
  });
}

// Function for adding a new department to the department table
let addDepartment = () => {
  inquirer.prompt([
    {
      type: "input",
      message: "Which department would you like to add?",
      name: "newDepartment"
    }
  ]).then((answer) => {
    db.query(`INSERT INTO department SET ?`,
      {
        name: answer.newDepartment
      });
    db.query(`SELECT department.name AS "Department", department.id AS "Department Id" FROM department;`, (err, result) => {
      if (err) throw err;
      console.log('Your department has been added!');
      console.table(result);
      initPrompt();
    });
  });
}

// Function for adding a new role to the role table
let addRole = () => {

}

// Function for adding a new employee to the employee table
let addEmployee = () => {

}

// Function for updating an already established employee
let updateEmployee = () => {

}

// Init
initPrompt();
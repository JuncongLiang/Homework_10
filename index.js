const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employees_DB"
});


// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
});


// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add department",
                "Add role",
                "Add employee",
                "View departments",
                "View roles",
                "View employees",
                "Update employee role",
                "EXIT"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add department":
                    addDepartment();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "Add employee":
                    addEmployee();
                    break;
                case "View departments":
                    viewDepartments();
                    break;
                case "View roles":
                    viewRoles();
                    break;
                case "View employees":
                    viewEmployees();
                    break;
                case "Update employee role":
                    updateRoles();
                    break;
                case "EXIT":
                    connection.end();
                    break;
            }
        })
}

// Add new department
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            message: "What department do you want to add?",
            name: "newDepartment"
        })
        .then(function (answer) {
            connection.query(
                "INSERT INTO department SET ?",
                { name: answer.newDepartment },
                function (err) {
                    if (err) throw err;
                    console.log("New Department was added!");
                    start();
                }
            );
        });
}

// Add new role
function addRole() {
    let department_ids = [];
    connection.query("SELECT department_id FROM role", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            department_ids.push(res[i].department_id);
        }
    });

    inquirer
        .prompt([
            {
                type: "input",
                message: "What role do you want to add?",
                name: "newRole"
            },
            {
                type: "input",
                message: "What is the role's salary?",
                name: "newSalary"
            },
            {
                type: "list",
                message: "What is the role's department ID?",
                name: "newDept",
                choices: department_ids
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.newRole,
                    salary: answer.newSalary,
                    department_id: answer.newDept
                },
                function (err) {
                    if (err) throw err;
                    console.log("New Role was added!");
                    start();
                }
            );
        });
}

// Add new employees
function addEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "firstName"
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "lastName"
            },
            {
                type: "input",
                message: "What is the employee's role ID?",
                name: "role_id"
            },
            {
                type: "input",
                message: "What is their manager's ID?",
                name: "manager_id",
                default: 0
            }
        ])
        .then(function (answer) {
            connection.query("INSERT INTO employee SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.role_id,
                    manager_id: answer.manager_id
                },
                function (err) {
                    if (err) throw err;
                    console.log("New Employee was added!");
                    start();
                }
            );
        });
}

// View current departments
function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}
// View current roles
function viewRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}
// View current employees
function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

//Update Employee's Role
function updateRoles() {
    connection.query("SELECT first_name, last_name, id FROM employee", function (
        err, res) {
        if (err) throw err;
        let employee = res.map(employee => ({
            name: employee.first_name + " " + employee.last_name,
            value: employee.id
        }));

        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Which employee's role do you want to change?",
                    name: "employeeName",
                    choices: employee
                },
                {
                    type: "input",
                    message: "What is the employee's new role?",
                    name: "newRole"
                },
                {
                    type: "input",
                    message: "What is the employee's new salary amount?",
                    name: "newSalary"
                }
            ])
            .then(function (answer) {
                connection.query("UPDATE role SET ? WHERE ?",
                    [
                        {
                            title: answer.newRole,
                            salary: answer.newSalary
                        },
                        {
                            id: answer.employeeName
                        }
                    ],
                    function (err, res) {
                        if (err) throw err;
                        console.log("Employee data updated!");
                        console.table(res);
                        start();
                    }
                );
            });
    });
}




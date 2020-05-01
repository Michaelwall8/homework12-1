// =====================================================================================================================
// =====================================\ Employee Tracker - Homework 12 /==============================================
// =====================================================================================================================

// Require npm
const mysql = require('mysql2/promise')
const inquirer = require('inquirer');
const consoleT = require('console.table');

// Connection var
let connnection

// inquirer menu
const view_employees = "View employees";
const view_departments = "View departments";
const view_roles = "View roles";
const add_department = "Add department";
const add_role = "Add role";
const add_employee = "Add employee";
const update_employee_role = "Update employee role";
const exit = "Exit";

// Principal Function to trigger the application
main()

// ------------------------------\ Setup /------------------------------------
async function main () {
  try {
    await connect()
    await userMenu()
  } catch (err) {
    console.error(err)
  } finally {
    connection.end()
  }
}
async function connect () {
  connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'sum182magodeoz',   // ================ Remember to add your PASSWORD here!
    database: 'employees_db'
  })
  console.log('Connected to MySQL as id: ' + connection.threadId)
}

// ------------------------------\ Prompt Menu /----------------------------------
async function userMenu() {
    await inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            view_employees,
            view_departments,
            view_roles,
            add_department,
            add_role,
            add_employee,
            update_employee_role,
            exit
        ]
    }).then(async function (answer) {
        switch (answer.action) {
            case view_employees:
                await viewEmployees();
                break;
            case view_departments:
                await viewDepartments();
                break;
            case view_roles:
                await viewRoles();
                break;    
            // case add_department:
            //     addDepartment();
            //     break;
            // case add_role:
            //     addRole();
            //     break;
            // case add_employee:
            //     addEmployee();
            //     break;
            // case update_employee_role:
            //     updateEmployeeRole();
            //     break;
            case exit:
                console.log("Employee Tracker has ended");
                connection.end();
                break;
        };
    });
};

// ------------------------------------------------\ Async Functions /---------------------------------------------------

// ----------\ VIEW /------------
async function viewEmployees () {
    const [rows] = await connection.query('SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e INNER JOIN role ON e.role_id = role.id  INNER JOIN department ON role.department_id = department.id LEFT JOIN employee m ON m.id = e.manager_id')
    console.table(rows)
    await userMenu();
}

async function viewDepartments() {
    const [rows] = await connection.query('SELECT * FROM department')
    console.table(rows)
    await userMenu();
};
async function viewRoles() {
    const [rows] = await connection.query('SELECT role.id, title, salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id')
    console.table(rows)
    await userMenu();
};



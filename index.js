// =====================================================================================================================
// =====================================\ Employee Tracker - Homework 12 /==============================================
// =====================================================================================================================

// Require npm
const mysql = require('mysql2/promise')
const inquirer = require('inquirer');
const consoleT = require('console.table');

// Require local modules
const db = require('./modules/generate_db.js');
const cnv = require('./modules/convert_ID.js');

// Connection var
let connnection

// Space between lines
const space = '\n \n'

// inquirer menu
const view_employees = 'View Employees';
const view_employees_by_manager = 'View Employees by Manager'
const view_departments = 'View Departments';
const view_roles = 'View Roles';
const view_budgets = 'View Budgets';
const add_department = 'Add Department';
const add_role = 'Add Role';
const add_employee = 'Add Employee';
const update_employee_role = 'Update Employee Role';
const update_employee_manager = 'Update Employee Manager';
const delete_employee = 'Delete Employee';
const delete_department = 'Delete Department';
const delete_role = 'Delete Role';
const exit = 'Exit';

// Principal Function to trigger the application
main()

// ------------------------------\ Setup /------------------------------------ \\
async function main () { 
  try {
    await connect()
    console.log(db.welcome) 
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
    password: '',   // ================ Remember to add your PASSWORD here!
    database: 'employees_db'
  })
  console.log(`\x1b[95m >>> Connected to MySQL as id: ${connection.threadId} <<< \x1b[39m`)
}

// ------------------------------\ Prompt Menu /---------------------------------- \\
async function userMenu() {
    await inquirer.prompt({
        name: "action",
        type: "list",
        message: "\x1b[96m>>> What would you like to do? <<<\x1b[39m" + space,
        choices: [
            view_employees,
            view_employees_by_manager,
            view_departments,
            view_roles,
            view_budgets,
            add_department,
            add_role,
            add_employee,
            update_employee_role,
            update_employee_manager,
            delete_employee,
            delete_department,
            delete_role,
            exit
        ]
    }).then(async function (answer) {
        switch (answer.action) {
            case view_employees:
                await viewEmployees();
                break;
            case view_employees_by_manager:
                await viewEmployeesByManager();
                break;    
            case view_departments:
                await viewDepartments();
                break;
            case view_roles:
                await viewRoles();
                break;
            case view_budgets:
                await viewBudgets();
                break;
            case add_employee:
                await addEmployee();
                break;        
            case add_department:
                await addDepartment();
                break;
            case add_role:
                await addRole();
                break;
            case update_employee_role:
                await updateEmployeeRole();
                break;
            case update_employee_manager:
                await updateEmployeeManager();
                break;
            case delete_employee:
                await deleteEmployee();
                break;
            case delete_department:
                await deleteDepartment();
                break;
            case delete_role:
                await deleteRole();
                break;          
            case exit:
                console.log(db.goodbye)
                console.log("\x1b[95m>>> Employee Tracker has ended <<<\x1b[39m");
                connection.end();
                break;
        };
    });
}; 

// ------------------------------------------------\ Async Functions /---------------------------------------------------

// -------------------------\ VIEW /------------------------ \\
// Display updated Employees listzx 
async function viewEmployees () {
    const [rows] = await connection.query('SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e INNER JOIN role ON e.role_id = role.id  INNER JOIN department ON role.department_id = department.id LEFT JOIN employee m ON m.id = e.manager_id')
    console.table(rows)
    await userMenu();
}

// Display updated Employees list by Manager
async function viewEmployeesByManager() {
  await inquirer.prompt(
      {
        type: 'list',  
        message: 'Choose the Manager',
        name: 'manager',
        choices: await db.namesGenerator()
      }
  ).then(async function ({ manager }) {
      const [rows] = await connection.query(`SELECT e.id, e.first_name, e.last_name, role.title, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee m ON m.id = e.manager_id WHERE m.id = ${await cnv.getEmployeeId(manager)}`)
      console.table(rows)
      await userMenu()
  })
}

// Display updated Departments list
async function viewDepartments() {
    const [rows] = await connection.query('SELECT * FROM department')
    console.table(rows)
    await userMenu();
};

// Display updated Roles list
async function viewRoles() {
    const [rows] = await connection.query('SELECT role.id, title, salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id')
    console.table(rows)
    await userMenu();
};

// Display updated Budgets list, organized by departments
async function viewBudgets() {
  const [rows] = await connection.query('SELECT department.id, name, SUM(role.salary) total_budget FROM department INNER JOIN role ON department.id = role.department_id INNER JOIN employee ON role.id = employee.role_id GROUP BY department.id')
  console.table(rows)
  await userMenu();
};

// -------------------------\ ADD /-------------------------- \\
// creates new Employee into the db
async function addEmployee() {
    
    await inquirer.prompt([{
        message: 'Enter Name:',
        name: 'firstName'
      },
      {
        message: 'Enter Last Name:',
        name: 'lastName'
      },
      {
        type: 'list',  
        message: 'Select a Role',
        name: 'role',
        choices: await db.rolesGenerator()
      },
      {
        type: 'list',  
        message: 'Who is the Manager',
        name: 'manager',
        choices: await db.namesGenerator()
      }
    ]).then(async function ({ firstName, lastName, role, manager }) {

        const [rows] = await connection.query('INSERT INTO employee SET ?', {
            first_name: firstName,
            last_name: lastName,
            role_id: await cnv.getRoleId(role),
            manager_id: await cnv.getEmployeeId(manager)
        })
        console.log(`\x1b[92msucced, new employee: ${firstName} ${lastName}, added${space}\x1b[39m`)
        await userMenu()
    })

}

// creates new Department into the db
async function addDepartment() {
    await inquirer.prompt(
        {
            name: "department",
            type: "input",
            message: "What department would you like to add?"
        }

    ).then(async function ({ department }) {
        const [rows] = await connection.query('INSERT INTO department SET ?',{
                name: department
            })
        console.log(`\x1b[92mSucced, new department: ${department}, added${space}\x1b[39m`)
        await userMenu()
    })
}

// creates new Role into the db
async function addRole() {
    
    await inquirer.prompt([{
        message: 'Enter Title:',
        name: 'title'
      },
      {
        message: 'Enter Salary:',
        name: 'salary'
      },
      {
        type: 'list',  
        message: 'Choose Department',
        name: 'department',
        choices: await db.departmentsGenerator()
      }
    ]).then(async function ({ title, salary, department }) {

        const [rows] = await connection.query('INSERT INTO role SET ?', {
            title: title,
            salary: salary,
            department_id: await cnv.getDepartmentId(department)
        })
        console.log(`\x1b[92msucced, new Role: ${title}, added${space}\x1b[39m`)
        await userMenu()
    })

}

// ----------------------------\ UPDATE /------------------------------ \\
// update employee Role 
async function updateEmployeeRole() {
    await inquirer.prompt([{
        type: 'list',  
        message: 'Choose Employee',
        name: 'name',
        choices: await db.namesGenerator()
      },
      {
        type: 'list',  
        message: 'Choose New Role',
        name: 'role',
        choices: await db.rolesGenerator()
      }
    ]).then(async function ({ name, role }) {
        const [rows] = await connection.query('UPDATE employee SET ? WHERE ?',[
            {role_id: await cnv.getRoleId(role)},
            {id: await cnv.getEmployeeId(name)}
        ])

        console.log(`\x1b[92msucced, Employee: ${name}, Role updated${space}\x1b[39m`)
        await userMenu()
    })
}

// update employee Manager 
async function updateEmployeeManager() {
  await inquirer.prompt([{
      type: 'list',  
      message: 'Choose Employee',
      name: 'name',
      choices: await db.namesGenerator()
    },
    {
      type: 'list',  
      message: 'Choose New Manager',
      name: 'manager',
      choices: await db.namesGenerator()
    }
  ]).then(async function ({ name, manager }) {
      const [rows] = await connection.query('UPDATE employee SET ? WHERE ?',[
          {manager_id: await cnv.getEmployeeId(manager)},
          {id: await cnv.getEmployeeId(name)}
      ])

      console.log(`\x1b[92msucced, Employee: ${name}, Manager updated${space}\x1b[39m`)
      await userMenu()
  })
}

// ----------------------------\ DELETE /------------------------------ \\
// Delete employee
async function deleteEmployee() {
  await inquirer.prompt([{
      type: 'list',  
      message: 'Choose Employee',
      name: 'name',
      choices: await db.namesGenerator()
    }
  ]).then(async function ({ name }) {
      const [rows] = await connection.query('DELETE FROM employee WHERE ?', [
        {
          id: await cnv.getEmployeeId(name)  
        }
    ])

      console.log(`\x1b[92msucced, Employee: ${name}, deleted${space}\x1b[39m`)
      await userMenu()
  })
}

// Delete department
async function deleteDepartment() {
  await inquirer.prompt([{
      type: 'list',  
      message: 'Choose Department',
      name: 'department',
      choices: await db.departmentsGenerator()
    }
  ]).then(async function ({ department }) {
      const [rows] = await connection.query('DELETE FROM department WHERE ?', [
        {
          id: await cnv.getDepartmentId(department)  
        }
    ])

      console.log(`\x1b[92msucced, Department: ${department}, deleted${space}\x1b[39m`)
      await userMenu()
  })
}

// Delete role
async function deleteRole() {
  await inquirer.prompt([{
      type: 'list',  
      message: 'Choose Role',
      name: 'role',
      choices: await db.rolesGenerator()
    }
  ]).then(async function ({ role }) {
      const [rows] = await connection.query('DELETE FROM role WHERE ?', [
        {
          id: await cnv.getRoleId(role)  
        }
    ])

      console.log(`\x1b[92msucced, Employee: ${role}, deleted${space}\x1b[39m`)
      await userMenu()
  })
}

// =====================================================================================================================
// ====================================================\ END /==========================================================
// =====================================================================================================================
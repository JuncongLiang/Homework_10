USE employees_DB;

INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", "100000", "1"), ("Lead Engineer", "190000", "2"),("Accountant", "125000", "3"), ("Legal Team Lead", "250000", "4");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", "1", "1"), ("Mike", "Chan", "2", "2"), ("Malia", "Brown", "3", "3"),("Sarah", "Lourd", "4", "4");

SELECT * FROM ((department
INNER JOIN role ON department.id = role.id)
INNER JOIN employee ON department.id = employee.id);
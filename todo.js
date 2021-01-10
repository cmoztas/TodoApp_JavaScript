const form = document.querySelector("#todo-form");
const taskInput = document.querySelector("#task");
const todo = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todo");

eventListeners();

function eventListeners() {
    form.addEventListener("submit", addTask);
    document.addEventListener("DOMContentLoaded", loadTodo);
    secondCardBody.addEventListener("click", deleteTask);
    filter.addEventListener("keyup", filterTodo);
    clearButton.addEventListener("click", clearTodo);
}

function addTask(e) {
    e.preventDefault();
    const newTask = taskInput.value.trim();

    if (newTask === "") {
        showAlert("danger", "Please enter a task..");
    } else {
        addTaskToUI(newTask);
        addTaskToStorage(newTask);
        showAlert("success", "Task added");
    }
}

function addTaskToUI(newTask) {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";

    const link = document.createElement("a");
    link.href = "#!";
    link.className = "delete-item";
    link.innerHTML = `<i class = "fa fa-remove"></i>`;

    listItem.appendChild(document.createTextNode(newTask));
    listItem.appendChild(link);

    todo.appendChild(listItem);
    taskInput.value = "";
}

function getTodoFromStorage() {
    let todo;

    if (localStorage.getItem("todo") === null) {
        todo = [];
    } else {
        todo = JSON.parse(localStorage.getItem("todo"));
    }

    return todo;
}

function addTaskToStorage(newTask) {
    let todo = getTodoFromStorage();

    todo.push(newTask)
    localStorage.setItem("todo", JSON.stringify(todo));
}

function loadTodo() {
    let todo = getTodoFromStorage();
    todo.forEach(task => {
        addTaskToUI(task);
    })
}

function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.setAttribute("role", "alert");
    alert.innerText = message;
    firstCardBody.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 2000);
}

function deleteTask(e) {
    if (e.target.className === "fa fa-remove") {
        const task = e.target.parentElement.parentElement;
        task.remove();
        deleteTaskFromStorage(task.textContent);
        showAlert("success", "Task is successfully deleted.");
    }
}

function deleteTaskFromStorage(deleteTask) {
    let todo = getTodoFromStorage();

    todo.forEach((task, index) => {
        if (task === deleteTask) {
            todo.splice(index, 1);
        }
    });

    localStorage.setItem("todo", JSON.stringify(todo));
}

function filterTodo(e){
    const filterValue = e.target.value.toLowerCase();
    const list = document.querySelectorAll(".list-group-item");

    list.forEach(task => {
        const text = task.textContent.toLowerCase();

        if (text.indexOf(filterValue) === -1) {
            task.classList.add("d-none");
            task.classList.remove("d-flex");
        } else {
            task.classList.add("d-flex")
            task.classList.remove("d-none");
        }
    })
}

function clearTodo() {
    if (confirm("Are you sure to delete all tasks?")) {
        while(todo.firstElementChild != null) {
            todo.removeChild(todo.firstElementChild);
        }

        localStorage.removeItem("todo");
    }
}
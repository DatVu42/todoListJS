

console.log(add(1, 2));

function renderTodoStatus(todo, alertElement, btnMarkAsDone) {
  if (!todo || !alertElement || !btnMarkAsDone) return null;

  // change alert color
  const alertClass =
    todo.status === "pending" ? "alert-secondary" : "alert-success";
  alertElement.classList.remove("alert-secondary");
  alertElement.classList.add(alertClass);

  // change color and content of button
  const btnMarkAsDoneClass =
    todo.status === "pending" ? "btn-dark" : "btn-success";
  const btnMarkAsDoneContent = todo.status === "pending" ? "Finish" : "Reset";
  btnMarkAsDone.classList.remove("btn-dark", "btn-success");
  btnMarkAsDone.classList.add(btnMarkAsDoneClass);
  btnMarkAsDone.textContent = btnMarkAsDoneContent;
}

function handleButtonRemove(btnRemove, todoElement, todo) {
  if (!btnRemove || !todoElement) return null;

  btnRemove.addEventListener("click", () => {
    // save to local storage
    const todoList = getTodoList();
    const newTodoList = todoList.filter((x) => x.id !== todo.id);
    localStorage.setItem("todo_list", JSON.stringify(newTodoList));

    // apply to DOM
    todoElement.remove();
  });
}

function handleButtonMarkAsDone(
  todo,
  btnMarkAsDone,
  alertElement,
  todoElement
) {
  if (!todo || !btnMarkAsDone || !alertElement || !todoElement) return null;

  btnMarkAsDone.addEventListener("click", () => {
    const currentStatus = todoElement.dataset.status;
    const newStatus = currentStatus === "pending" ? "completed" : "pending";

    // save to local storage
    const todoList = getTodoList();
    const index = todoList.findIndex((x) => x.id === todo.id);
    todoList[index].status = newStatus;
    localStorage.setItem("todo_list", JSON.stringify(todoList));

    // change alert
    const newAlertClass =
      currentStatus === "pending" ? "alert-success" : "alert-secondary";
    alertElement.classList.remove("alert-success", "alert-secondary");
    alertElement.classList.add(newAlertClass);
    todoElement.dataset.status = newStatus;

    // change button color and content
    const newBtnMarkAsDoneStyle =
      currentStatus === "pending" ? "btn-success" : "btn-dark";
    btnMarkAsDone.classList.remove("btn-success", "btn-dark");
    btnMarkAsDone.classList.add(newBtnMarkAsDoneStyle);

    const newBtnMarkAsDoneContent =
      currentStatus === "pending" ? "Reset" : "Finish";
    btnMarkAsDone.textContent = newBtnMarkAsDoneContent;
  });
}

function createTodoElement(todo) {
  if (!todo) return null;

  const todoTemplate = document.getElementById("todoTemplate");
  if (!todoTemplate) return null;

  // get elements
  const todoElement = todoTemplate.content.firstElementChild.cloneNode(true);
  const alertElement = todoElement.querySelector("div.alert");
  const btnMarkAsDone = todoElement.querySelector("button.mark-as-done");
  const btnRemove = todoElement.querySelector("button.remove");
  const btnEdit = todoElement.querySelector('button.edit');

  todoElement.querySelector("p.todo__title").textContent = todo.title;
  todoElement.dataset.status = todo.status;
  todoElement.dataset.id = todo.id;

  // render todo status
  renderTodoStatus(todo, alertElement, btnMarkAsDone);

  // handle button remove
  handleButtonRemove(btnRemove, todoElement, todo);

  // handle button mark as done
  handleButtonMarkAsDone(todo, btnMarkAsDone, alertElement, todoElement);

  // handle button Edit
  hanleButtonEdit(todo, btnEdit, todoElement);

  return todoElement;
}

function renderTodoList(todoList, ulElementId) {
  if (!Array.isArray(todoList) || todoList.length === 0) return null;

  const ulElement = document.getElementById(ulElementId);
  if (!ulElement) return null;

  for (const todo of todoList) {
    const liElement = createTodoElement(todo);

    ulElement.appendChild(liElement);
  }
}

function getTodoList() {
  try {
    return JSON.parse(localStorage.getItem("todo_list")) || [];
  } catch {
    return [];
  }
}

function hanleTodoFormSubmit(event) {
  event.preventDefault();
  
  const todoInput = document.getElementById('todoText');
  if (!todoInput) return;

  const newTodo = {
    id: Date.now(),
    title: todoInput.value,
    status: 'pending'
  }

  

  const todoList = getTodoList();
  todoList.push(newTodo);
  localStorage.setItem('todo_list', JSON.stringify(todoList));

  const newLiElement = createTodoElement(newTodo);
  const ulElement = document.getElementById('todoList');
  if (!ulElement) return;
  ulElement.appendChild(newLiElement);

  const todoForm = document.getElementById("todoFormId");
  if (todoForm) todoForm.reset();
  todoInput.focus();
}

function hanleButtonEdit(todo, btnEdit, todoElement) {
  btnEdit.addEventListener('click', () => {
      // const todoText = todoElement.querySelector('p.todo__title').textContent;
      const todoText = todo.title;
      if (!todoText) return;
      const todoForm = document.getElementById("todoFormId");
      if (!todoForm) return;
      const todoInput = todoForm.querySelector('#todoText');
      if (!todoInput) return;
      todoInput.value = todoText;
      todoForm.dataset.id = todo.id;
  })
}
  
(() => {
  // const todoList = [
  //   { id: 1, title: "HTML & CSS", status: "pending" },
  //   { id: 2, title: "JavaScript", status: "completed" },
  //   { id: 3, title: "ReactJS", status: "pending" },
  // ];
  const todoList = getTodoList();

  renderTodoList(todoList, "todoList");

  const todoForm = document.getElementById("todoFormId");
  if (todoForm) {
    todoForm.addEventListener("submit", hanleTodoFormSubmit);
  }
})();

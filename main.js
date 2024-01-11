
function getElement(selector) {
  if (!selector) return;

  return document.querySelector(selector);
}

function renderTodoStatus(todo, todoElement) {
  if (!todo || !todoElement) return;

  const alertElement = todoElement.querySelector('div.alert');
  const btnMarkAsDone = todoElement.querySelector('button.mark-as-done');

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

// function handleButtonRemove(todo) {
//   const btnRemove = getElement('#todoList button.remove');
//   console.log(btnRemove);

//   if (!btnRemove) return;

//   btnRemove.addEventListener("click", () => {
//     console.log('btnRemove');
//     // save to local storage
//     const todoList = getTodoList();
//     const newTodoList = todoList.filter((x) => x.id !== todo.id);
//     localStorage.setItem("todo_list", JSON.stringify(newTodoList));

//     // apply to DOM
//     todoElement.remove();
//   });
// }

// function handleButtonMarkAsDone(todo) {
//   const { btnMarkAsDone, alertElement, todoElement } = getElements();

//   if (!todo || !btnMarkAsDone || !alertElement || !todoElement) return null;

//   btnMarkAsDone.addEventListener("click", () => {
//     const currentStatus = todoElement.dataset.status;
//     const newStatus = currentStatus === "pending" ? "completed" : "pending";

//     // save to local storage
//     const todoList = getTodoList();
//     const index = todoList.findIndex((x) => x.id === todo.id);
//     todoList[index].status = newStatus;
//     localStorage.setItem("todo_list", JSON.stringify(todoList));

//     // change alert
//     const newAlertClass =
//       currentStatus === "pending" ? "alert-success" : "alert-secondary";
//     alertElement.classList.remove("alert-success", "alert-secondary");
//     alertElement.classList.add(newAlertClass);
//     todoElement.dataset.status = newStatus;

//     // change button color and content
//     const newBtnMarkAsDoneStyle =
//       currentStatus === "pending" ? "btn-success" : "btn-dark";
//     btnMarkAsDone.classList.remove("btn-success", "btn-dark");
//     btnMarkAsDone.classList.add(newBtnMarkAsDoneStyle);

//     const newBtnMarkAsDoneContent =
//       currentStatus === "pending" ? "Reset" : "Finish";
//     btnMarkAsDone.textContent = newBtnMarkAsDoneContent;
//   });
// }

function cloneTodo() {
  const todoTemplate = getElement('#todoTemplate');
  if (!todoTemplate) return;

  return todoTemplate.content.firstElementChild.cloneNode(true);
}

function createTodoElement(todo) {
  if (!todo) return;

  const todoElement = cloneTodo();
  if (!todoElement) return;

  todoElement.querySelector("p.todo__title").textContent = todo.title;
  todoElement.dataset.status = todo.status;
  todoElement.dataset.id = todo.id;

  // render todo status
  renderTodoStatus(todo, todoElement);

  // handle button remove
  // handleButtonRemove(todo);

  // handle button mark as done
  // handleButtonMarkAsDone(todo);

  return todoElement;
}

function renderTodoList(todoList, ulElementId) {
  if (!Array.isArray(todoList) || todoList.length === 0) return null;

  const ulElement = getElement(`#${ulElementId}`);
  if (!ulElement) return;

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

// function handleTodoFormSubmit(event) {
//   event.preventDefault();

//   const todoInput = document.getElementById('todoText');
//   if (!todoInput) return;

//   const newTodo = {
//     id: Date.now(),
//     title: todoInput.value,
//     status: 'pending'
//   }

//   const todoList = getTodoList();
//   todoList.push(newTodo);
//   localStorage.setItem('todo_list', JSON.stringify(todoList));

//   const newLiElement = createTodoElement(newTodo);
//   const ulElement = document.getElementById('todoList');
//   if (!ulElement) return;
//   ulElement.appendChild(newLiElement);

//   const todoForm = document.getElementById('todoFormId');
//   todoForm.reset();
//   todoInput.focus();
// }

(() => {
  // const todoList = [
  //   { id: 1, title: "HTML & CSS", status: "pending" },
  //   { id: 2, title: "JavaScript", status: "completed" },
  //   { id: 3, title: "ReactJS", status: "pending" },
  // ];
  const todoList = getTodoList();

  renderTodoList(todoList, "todoList");

  // const { todoForm } = getElements();

  // if (todoForm) {
  //   todoForm.addEventListener("submit", handleTodoFormSubmit);
  // }
})();

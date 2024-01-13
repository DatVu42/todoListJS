
function getElement(selector) {
  if (!selector) return;

  return document.querySelector(selector);
}

function renderTodoStatus(todo, todoElement) {
  if (!todo || !todoElement) return;

  const alertElement = todoElement.querySelector('div.alert');
  const btnMarkAsDone = todoElement.querySelector('button.mark-as-done');
  if (!alertElement || !btnMarkAsDone) return;

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

function handleButtonRemove(todo, todoElement) {
  if (!todo || !todoElement) return;

  const btnRemove = todoElement.querySelector('button.remove');
  if (!btnRemove) return;

  btnRemove.onclick = function () {
    // confirm before remove todo
    const confirmRemoveModal = getElement('#confirmRemoveModal');
    const btnConfirmRemove = confirmRemoveModal.querySelector('button.confirm');
    confirmRemoveModal.querySelector('div.modal-body').textContent = `Do you want to delete "${todo.title}"?`;

    btnConfirmRemove.onclick = function () {
      // save to local storage
      const todoList = getTodoList();
      const newTodoList = todoList.filter((x) => x.id !== todo.id);
      localStorage.setItem("todo_list", JSON.stringify(newTodoList));

      // apply to DOM
      todoElement.remove();
    };
  }
}

function handleButtonMarkAsDone(todo, todoElement, alertElement) {
  if (!todo || !alertElement || !todoElement) return;

  const btnMarkAsDone = todoElement.querySelector('button.mark-as-done');

  btnMarkAsDone.addEventListener("click", () => {
    const currentStatus = todoElement.dataset.status;
    const newStatus = currentStatus === "pending" ? "completed" : "pending";

    // save to local storage
    const todoList = getTodoList();
    const index = todoList.findIndex((x) => x.id === todo.id);
    todoList[index].status = newStatus;
    localStorage.setItem("todo_list", JSON.stringify(todoList));

    // change alert class
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

function cloneElement(elementId) {
  const elementTemplate = getElement(elementId);
  if (!elementTemplate) return;

  return elementTemplate.content.firstElementChild.cloneNode(true);
}

function handleButtonEdit(todoElement) {
  if (!todoElement) return;

  const btnEdit = todoElement.querySelector('button.edit');
  const todoForm = getElement('#todoFormId');
  if (!btnEdit || !todoForm) return;

  btnEdit.onclick = function () {
    const todoInput = getElement('#todoText');
    const todoTitle = todoElement.querySelector('p.todo__title');
    if (!todoInput || !todoTitle) return;

    todoInput.value = todoTitle.textContent;
    todoForm.dataset.id = todoElement.dataset.id;
  }
}

function createTodoElement(todo) {
  if (!todo) return;

  const todoElement = cloneElement('#todoTemplate');
  if (!todoElement) return;

  const alertElement = todoElement.querySelector('div.alert');
  if (!alertElement) return;

  todoElement.querySelector("p.todo__title").textContent = todo.title;
  todoElement.dataset.status = todo.status;
  todoElement.dataset.id = todo.id;

  // render todo status
  renderTodoStatus(todo, todoElement);

  // handle button remove
  handleButtonRemove(todo, todoElement);

  // handle button Mark as done
  handleButtonMarkAsDone(todo, todoElement, alertElement);

  // handle button Edit
  handleButtonEdit(todoElement);

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

function handleTodoFormSubmit(event) {
  event.preventDefault();

  const todoInput = getElement('#todoText');
  const todoForm = getElement('#todoFormId');
  const ulElement = getElement('#todoList');
  if (!todoInput || !todoForm || !ulElement) return;

  const todoList = getTodoList();

  const isEdit = Boolean(todoForm.dataset.id);

  if (isEdit) {
    const editLiElement = ulElement.querySelector(`li[data-id="${todoForm.dataset.id}"]`);
    editLiElement.querySelector('p.todo__title').textContent = todoInput.value;

    const index = todoList.findIndex(x => x.id.toString() === todoForm.dataset.id);
    if (index >= 0) todoList[index].title = todoInput.value;
    localStorage.setItem('todo_list', JSON.stringify(todoList));
  } else {
    const newTodo = {
      id: Date.now(),
      title: todoInput.value,
      status: 'pending'
    }

    todoList.push(newTodo);
    localStorage.setItem('todo_list', JSON.stringify(todoList));

    const newLiElement = createTodoElement(newTodo);
    if (ulElement) ulElement.appendChild(newLiElement);
  }

  todoForm.reset();
  delete todoForm.dataset.id;
  todoInput.focus();
}

(() => {
  // const todoList = [
  //   { id: 1, title: "HTML & CSS", status: "pending" },
  //   { id: 2, title: "JavaScript", status: "completed" },
  //   { id: 3, title: "ReactJS", status: "pending" },
  // ];
  const todoList = getTodoList();

  renderTodoList(todoList, "todoList");

  const todoForm = getElement('#todoFormId');

  if (todoForm) {
    todoForm.addEventListener("submit", handleTodoFormSubmit);
  }
})();

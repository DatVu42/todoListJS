function isMatchSearch(todoElement, searchTerm) {
  if (!todoElement) return false;
  if (searchTerm === "") return true;

  const titleElement = todoElement.querySelector("p.todo__title");
  if (!titleElement) return false;

  return titleElement.textContent
    .toLocaleLowerCase()
    .includes(searchTerm.toLocaleLowerCase());
}

function isMatchStatus(todoElement, status) {
  return status === "all" || todoElement.dataset.status === status;
}

function isMatch(todoElement, params) {
  return (
    isMatchSearch(todoElement, params.get("searchTerm")) &&
    isMatchStatus(todoElement, params.get("status"))
  );
}

function saveToLocalStorage(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}

function getElement(selector) {
  if (!selector) return;

  return document.querySelector(selector);
}

function getTodoList() {
  try {
    return JSON.parse(localStorage.getItem("todo_list")) || [];
  } catch {
    return [];
  }
}

function renderTodoStatus(todo, todoElement) {
  if (!todo || !todoElement) return;

  const alertElement = todoElement.querySelector("div.alert");
  const btnMarkAsDone = todoElement.querySelector("button.mark-as-done");
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

  const btnRemove = todoElement.querySelector("button.remove");
  if (!btnRemove) return;

  btnRemove.onclick = function () {
    // confirm before remove todo
    const confirmRemoveModal = getElement("#confirmRemoveModal");
    const btnConfirmRemove = confirmRemoveModal.querySelector("button.confirm");
    confirmRemoveModal.querySelector(
      "div.modal-body"
    ).textContent = `Do you want to delete "${todo.title}"?`;

    btnConfirmRemove.onclick = function () {
      // save to local storage
      const todoList = getTodoList();
      const newTodoList = todoList.filter((x) => x.id !== todo.id);
      saveToLocalStorage("todo_list", newTodoList);

      // apply to DOM
      todoElement.remove();
    };
  };
}

function handleButtonMarkAsDone(todo, todoElement, alertElement) {
  if (!todo || !alertElement || !todoElement) return;

  const btnMarkAsDone = todoElement.querySelector("button.mark-as-done");
  if (!btnMarkAsDone) return;

  btnMarkAsDone.onclick = function () {
    const currentStatus = todoElement.dataset.status;
    const newStatus = currentStatus === "pending" ? "completed" : "pending";

    // save to local storage
    const todoList = getTodoList();
    const index = todoList.findIndex((x) => x.id === todo.id);
    todoList[index].status = newStatus;
    saveToLocalStorage("todo_list", todoList);

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
  };
}

function cloneElement(elementId) {
  const elementTemplate = getElement(elementId);
  if (!elementTemplate) return;

  return elementTemplate.content.firstElementChild.cloneNode(true);
}

function handleButtonEdit(todoElement) {
  if (!todoElement) return;

  const btnEdit = todoElement.querySelector("button.edit");
  const todoForm = getElement("#todoFormId");
  if (!btnEdit || !todoForm) return;

  btnEdit.onclick = function () {
    const todoInput = getElement("#todoText");
    const todoTitle = todoElement.querySelector("p.todo__title");
    const todoCheck = getElement("#todoCheck");
    if (!todoInput || !todoTitle || !todoCheck) return;

    todoInput.value = todoTitle.textContent;
    todoForm.dataset.id = todoElement.dataset.id;

    // change todo check status
    todoCheck.checked = todoElement
      .querySelector(".alert")
      .classList.contains("alert-success");
  };
}

function createTodoElement(todo, params) {
  if (!todo) return;

  const todoElement = cloneElement("#todoTemplate");
  if (!todoElement) return;

  const alertElement = todoElement.querySelector("div.alert");
  if (!alertElement) return;

  const todoTile = todoElement.querySelector("p.todo__title");
  if (!todoTile) return;
  todoTile.textContent = todo.title;
  todoElement.dataset.status = todo.status;
  todoElement.dataset.id = todo.id;

  const isShow = isMatch(todoElement, params);
  todoElement.hidden = !isShow;

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

function renderTodoList(todoList, ulElementId, params) {
  if (!Array.isArray(todoList) || todoList.length === 0) return null;

  const ulElement = getElement(`#${ulElementId}`);
  if (!ulElement) return;

  for (const todo of todoList) {
    const liElement = createTodoElement(todo, params);

    ulElement.appendChild(liElement);
  }
}

function handleTodoFormSubmit(event) {
  event.preventDefault();

  const todoInput = getElement("#todoText");
  const todoForm = getElement("#todoFormId");
  const ulElement = getElement("#todoList");
  const todoList = getTodoList();
  if (!todoInput || !todoForm || !ulElement || !todoList) return;

  const isEdit = Boolean(todoForm.dataset.id);
  const isChecked = getElement("#todoCheck").checked;
  const newStatus = isChecked ? "completed" : "pending";

  if (isEdit) {
    // save to local storage
    const index = todoList.findIndex(
      (x) => x.id.toString() === todoForm.dataset.id
    );
    if (index >= 0) {
      todoList[index].title = todoInput.value;
      todoList[index].status = newStatus;
    }
    saveToLocalStorage("todo_list", todoList);

    // apply to DOM
    const editLiElement = ulElement.querySelector(
      `li[data-id="${todoForm.dataset.id}"]`
    );
    if (!editLiElement) return;

    editLiElement.querySelector("p.todo__title").textContent = todoInput.value;

    const alertElement = editLiElement.querySelector(".alert");
    if (!alertElement) return;
    const alertClass = isChecked ? "alert-success" : "alert-secondary";
    alertElement.classList.remove("alert-success", "alert-secondary");
    alertElement.classList.add(alertClass);

    const btnMarkAsDone = editLiElement.querySelector("button.mark-as-done");
    if (!btnMarkAsDone) return;
    const btnMarkAsDoneClass = isChecked ? "btn-success" : "btn-dark";
    btnMarkAsDone.classList.remove("btn-success", "btn-dark");
    btnMarkAsDone.classList.add(btnMarkAsDoneClass);
    const btnMarkAsDoneContent = isChecked ? "Reset" : "Finish";
    btnMarkAsDone.textContent = btnMarkAsDoneContent;

    // update todo element status
    editLiElement.dataset.status = todoList[index].status;
  } else {
    const newTodo = {
      id: Date.now(),
      title: todoInput.value,
      status: newStatus,
    };

    todoList.push(newTodo);
    saveToLocalStorage("todo_list", todoList);

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
  //   { id: 4, title: "NextJS", status: "pending" },
  // ];
  const todoList = getTodoList();

  const params = new URLSearchParams(location.search);

  renderTodoList(todoList, "todoList", params);

  const todoForm = getElement("#todoFormId");

  if (todoForm) {
    todoForm.addEventListener("submit", handleTodoFormSubmit);
  }
})();

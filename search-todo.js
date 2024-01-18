function getElement(selector) {
  return document.querySelector(selector);
}

function getAllElements(selector) {
  return document.querySelectorAll(selector);
}

function isMatch(todoElement, searchTerm) {
  if (!todoElement) return false;
  if (searchTerm === '') return true;

  const titleElement = todoElement.querySelector('p.todo__title');
  if (!titleElement) return false;

  return titleElement.textContent.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
}

function searchTodo(searchTerm) {
  const todoElementList = getAllElements('#todoList > li');
  if (!todoElementList) return;

  for (const todoElement of todoElementList) {
    const isShow = isMatch(todoElement, searchTerm);

    todoElement.hidden = !isShow;
  }
}

function initSearchInput() {
  const searchInput = getElement('#searchTerm');
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    searchTodo(searchInput.value);
  });
}

function filterTodo(status) {
  const todoElementList = getAllElements('#todoList > li');
  if (!todoElementList) return;

  for (const todoElement of todoElementList) {
    const isShow = status === 'all' || todoElement.dataset.status === status;

    todoElement.hidden = !isShow;
  }
}

function initFilterStatus() {
  const filterStatusSelect = getElement('#filterStatus');
  if (!filterStatusSelect) return;

  filterStatusSelect.addEventListener('change', () => {
    filterTodo(filterStatusSelect.value);
  })
}

// MAIN
(() => {
  initSearchInput();
  initFilterStatus();
})();

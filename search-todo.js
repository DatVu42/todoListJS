function getElement(selector) {
  return document.querySelector(selector);
}

function isMatch(todoElement, searchTerm) {
  const titleElement = todoElement.querySelector('p.todo__title');
    
  return titleElement.textContent.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
}

function searchTodo(searchTerm) {
  const todoElementList = document.querySelectorAll('#todoList > li');
  
  for (const todoElement of todoElementList) {
    const isShow = isMatch(todoElement, searchTerm);

    todoElement.hidden = !isShow;
  }
}

function initSearchInput() {
  const searchInput = getElement('#searchTerm');

  searchInput.addEventListener("input", () => {
    searchTodo(searchInput.value);
  });
}

// MAIN
(() => {
  initSearchInput();
})();

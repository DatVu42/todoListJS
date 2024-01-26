function getElement(selector) {
  return document.querySelector(selector);
}

function getAllElements(selector) {
  return document.querySelectorAll(selector);
}

function isMatchSearch(todoElement, searchTerm) {
  if (!todoElement) return false;
  if (searchTerm === "") return true;

  const titleElement = todoElement.querySelector("p.todo__title");
  if (!titleElement) return false;

  return titleElement.textContent
    .toLocaleLowerCase()
    .includes(searchTerm.toLocaleLowerCase());
}

function initSearchInput(params) {
  const searchInput = getElement("#searchTerm");
  if (!searchInput) return;

  if (params.get('searchTerm')) {
    searchInput.value = params.get('searchTerm');
  }

  searchInput.addEventListener("input", () => {
    handleFilterChange("searchTerm", searchInput.value);
  });
}

function isMatchStatus(todoElement, status) {
  return status === "all" || todoElement.dataset.status === status;
}

function initFilterStatus(params) {
  const filterStatusSelect = getElement("#filterStatus");
  if (!filterStatusSelect) return;

  if (params.get('status')) {
    filterStatusSelect.value = params.get('status');
  }

  filterStatusSelect.addEventListener("change", () => {
    handleFilterChange("status", filterStatusSelect.value);
  });
}

function isMatch(todoElement, params) {
  // fix when submit form
  if (!params) return true;

  return (
    isMatchSearch(todoElement, params.get("searchTerm")) &&
    isMatchStatus(todoElement, params.get("status"))
  );
}

function handleFilterChange(filterName, filterValue) {
  // update query params
  const url = new URL(window.location);

  const searchInput = getElement("#searchTerm");
  if (searchInput.value === "") {
    url.searchParams.set("searchTerm", "");
  }

  const filterStatus = getElement("#filterStatus");
  if (filterStatus.value === "all") {
    url.searchParams.set("status", "all");
  }

  url.searchParams.set(filterName, filterValue);
  history.pushState({}, "", url);

  const todoElementList = getAllElements("#todoList > li");
  if (!todoElementList) return;

  for (const todoElement of todoElementList) {
    const isShow = isMatch(todoElement, url.searchParams);

    todoElement.hidden = !isShow;
  }
}

// MAIN
(() => {
  const params = new URLSearchParams(location.search);

  initSearchInput(params);
  initFilterStatus(params);
})();

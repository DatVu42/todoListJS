
function initSearchInput() {
    const searchInput = document.getElementById('searchTerm');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        console.log(searchInput.value);
    })
}

(() => {
    initSearchInput();
})()
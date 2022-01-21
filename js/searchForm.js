class searchForm {
  constructor(form) {
    this.searchInputElement = grabElement("searchInput");
    this.searchButton = grabElement("searchButton");

    this.formLogic();
    this.resultList = new searchResult(grabElement("foundList"));
    this.onSearch = () => {
      this.searchWord = form.querySelector("input[name='searchInput']").value;
      getServerResponse(this.searchWord, "search")
        .then((res) => res.json())
        .then((data) => {
          this.resultList.renderResults(data);
        });
    };
  }
  formLogic() {
    this.performSearch = debounce(this.performSearch, 500);
    this.searchInputElement.addEventListener("input", this.performSearch);
    this.searchButton.addEventListener("click", this.performSearch);
    this.searchInputElement.value = getQueryStringParams("query"); //Sets search bar according to query string param
    if (this.searchInputElement.value) this.searchButton.click(); //If there is a value in query, search.
  }
  async performSearch() {
    const searchWord = document.querySelector(
      "input[name='searchInput']"
    ).value;
    if (history.pushState) {
      let newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?query=${searchWord}`;
      window.history.pushState({ path: newurl }, "", newurl);
    }
    toggleVisibility(loadSpinner, true);
    grabElement("foundList").innerHTML = "";
    search.onSearch();
  }
}

//Page setup

class SearchForm {
  constructor(form) {
    this.searchInputElement = form.querySelector("input[name='searchInput']");
    if (getQueryStringParams("query")) {
      this.searchInputElement.value = getQueryStringParams("query");
      this.doSearch();
    }

    this.searchButton = form.querySelector("button[id='searchButton']");

    this.searchButton.onclick = debounce(this.doSearch.bind(this), 500);
    this.searchInputElement.oninput = debounce(this.doSearch.bind(this), 500);
  }
  onSearch(callback) {
    this.searchCallbackFunc = callback;
  }
  async doSearch() {
    toggleVisibility(loadSpinner, true);
    const query = this.searchInputElement.value;
    this.setQueryString(query);
    const request = await getServerResponse(query, "search");
    const companies = await request.json();

    this.searchCallbackFunc(companies);
  }
  setQueryString(query) {
    if (history.pushState) {
      let newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?query=${query}`;
      window.history.pushState({ path: newurl }, "", newurl);
    }
  }
}

//Page setup

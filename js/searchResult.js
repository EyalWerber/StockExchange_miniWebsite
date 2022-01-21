class searchResult {
  constructor(element) {
    this.element = element;
    this.element.innerHTML = "";
  }
  highlight(text) {
    const searchString = getQueryStringParams("query");

    const lowerText = text.toLowerCase();
    const foundIndex = lowerText.indexOf(searchString);
    if (foundIndex >= 0) {
      text =
        text.substring(0, foundIndex) +
        "<div class='highlight'>" +
        text.substring(foundIndex, foundIndex + searchString.length) +
        "</div>" +
        text.substring(foundIndex + searchString.length);
    }
    console.log(text);
    return text;
  }
  getAllResultSymbols(searchResult) {
    return searchResult.map((res) => {
      return res.symbol;
    });
  }
  renderResults(companyList) {
    this.element.innerHTML = "";
    if (companyList.length) {
      toggleExpansion(companyList.length);
      setTimeout(() => {
        this.craeteResultList(
          this.getAllResultSymbols(companyList),
          this.element
        );
      }, 700);
    } else {
      toggleExpansion(1);
      this.element.innerHTML += `<li class='resultText'>We didnt find anything... :'( </li><hr>`;
      toggleVisibility(grabElement("spinner"), false);
    }
  }

  //Compose search result object content
  searchItem(companyData) {
    let { image, companyName, changesPercentage } = companyData.profile;

    let elementsCompose = {
      href: `${CONFIG.companyLinks}${companyData.symbol}`,
      tags: [
        {
          type: "a",
          content: `<img src=${image}></img> ${this.highlight(companyName)}`,
        },
        {
          type: "span",
          content: `${this.highlight(companyData.symbol)}${setGoodBad(
            changesPercentage
          )}`,
        },
      ],
    };
    return elementsCompose;
  }
  //Compose hover wrapper of search result item
  anchorWrapper() {
    const wrapper = document.createElement("a"); //Initialize an anchor wrapper element to make whole area clickable (formerly li)
    wrapper.classList.add("resultItem", "flex"); //Set li wrapper class (add flex in milestone 3)
    return wrapper;
  }
  //Wrap  search result item
  composeResultLinkTextElement(type, content) {
    const domElement = document.createElement(type); //Initialize object Element
    domElement.innerHTML = content;
    return domElement;
  }
  composeResultListLink(searchItem, wrapper) {
    for (let tag of searchItem.tags) {
      let { type, content } = tag; //Deconstruct composed elements
      const domElement = this.composeResultLinkTextElement(type, content); //Initialize object Element
      wrapper.append(domElement); //Append to li wrapper
    }
    wrapper.setAttribute("href", searchItem.href);
    return wrapper;
  }
  async craeteResultList(symbols, parent) {
    const data = await this.getProfileChunks(symbols);
    for (let company of data) {
      let anchorTagElement = this.composeResultListLink(
        this.searchItem(company),
        this.anchorWrapper()
      );

      toggleVisibility(grabElement("spinner"), false);
      parent.append(anchorTagElement); // Append li wrapper to parent
    }
  }

  spliceSymbolArr(symbols) {
    let toslice = [...symbols];
    let slicedArr = [];
    for (let i = 0; i < symbols.length / 3; i++) {
      slicedArr.push(toslice.splice(0, 3));
    }
    return slicedArr;
  }
  makePromiseArray(symbolChunks) {
    let promiseArray = [];
    for (let chunk of symbolChunks) {
      promiseArray.push(getServerResponse(chunk, "profile"));
    }
    return promiseArray;
  }

  async requestChunk(symbols) {
    let symbolChunks = this.spliceSymbolArr(symbols);
    let promises = this.makePromiseArray(symbolChunks);
    let responses = await Promise.all(promises);
    return responses;
  }

  async getProfileChunks(symbols, allData = []) {
    const responses = await this.requestChunk([...symbols]);
    for (let response of responses) {
      // If there is more then 1 item(has companyProfiles key)
      const chunkData = await response.json();
      chunkData.companyProfiles
        ? chunkData.companyProfiles.forEach(async (item) => {
            allData.push(item);
          })
        : allData.push(chunkData);
    }
    return allData;
  }
}

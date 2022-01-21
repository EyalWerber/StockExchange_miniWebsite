///#####<Pure helper functions>#####
const loadSpinner = grabElement("spinner");
function grabElement(id) {
  const domElement = document.getElementById(id);
  if (domElement) return domElement;
  else throw new Error(`Couldn't find an element with ID : ${id}`);
}

//Recieves a symbol as inputs, formats and fetches a response from different server endpoint options(op)
async function getServerResponse(input, op) {
  console.log("REQUEST MADE");
  switch (op) {
    case "search":
      response = await fetch(
        `${CONFIG.APIServer}${CONFIG.seachAppendix.s}${input}${CONFIG.seachAppendix.a}`
      );
      return response;
    case "profile":
      response = await fetch(`${CONFIG.profileEndpoint}${input}`);
      return response;
    case "history":
      response = await fetch(`${CONFIG.historyEndpoint}${input}?serietype=line
      `);
      return response;
    case "marquee":
      response = await fetch(`${CONFIG.marqueeEndpoint}`);
      return response;
  }
}

//Inserts result into any dom element
function updateResultInDom(domElem, value) {
  domElem.innerHTML = value;
}

//Toggle visibility of a dom element
function toggleVisibility(elem, bool) {
  bool ? elem.classList.remove("d-none") : elem.classList.add("d-none");
}

//Expand container
function toggleExpansion(resultLen) {
  container = grabElement("searchContainer");
  container.style.height = 100 + 60 * resultLen + "px";
}
//Milestone 2.2
//Get query parameters from browser searchbar
function getQueryStringParams(param) {
  const urlParams = new URLSearchParams(window.location.search);
  const symbol = urlParams.get(param);
  return symbol;
}
//Get red span element if price went down, green if up
function setGoodBad(pChange, price = "") {
  retElem = document.createElement("span");
  if (pChange >= 0) {
    retElem.classList.add("good");
  } else {
    retElem.classList.add("bad");
  }
  retElem.innerHTML = price
    ? `${parseFloat(price).toFixed(2)}$`
    : `(%${parseFloat(pChange).toFixed(2)})`;
  return retElem.outerHTML;
}
function makeMarqueeElement(data) {
  marqueeSpan = document.createElement("span");
  marqueeSpan.classList.add("marqueeText");
  for (stock of data) {
    marqueeSpan.innerHTML += `${stock.symbol} -${setGoodBad(
      stock.change,
      stock.price
    )}|`;
  }
  document.getElementById("marqueeElement").append(marqueeSpan);
}
async function setMarquee() {
  response = await getServerResponse("", "marquee");
  data = await response.json();

  makeMarqueeElement(data.slice(-50));
}
///#####</Pure helper functions>#####
//Milestone 2.1
//Debounce takes a function and returns a function after a given delay time
const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer); //Clear timeout cancels previously established timeout, which lays in timer var
    timer = setTimeout(() => {
      func(...args); //Invoke function after timeout!
    }, delay);
  };
};

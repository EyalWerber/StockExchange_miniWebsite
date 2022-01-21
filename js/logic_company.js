///#####<profile page main logic>#####

//Get stock history data by symbol
async function getHistoryData(symbol) {
  let response = await getServerResponse(symbol, "history");
  let data = await response.json();
  xlabels = [];
  ylabels = [];
  for (let element of data.historical.slice(0, 1000)) {
    xlabels.push(element.close);
    ylabels.push(element.date);
  }
  return [xlabels.reverse(), ylabels.reverse(), symbol]; //Sets the graph after whole profile page is made
}

//Set profile page

async function getProfileData(symbol) {
  response = await getServerResponse(symbol, "profile");
  profileData = await response.json();
  return profileData;
}
async function setProfilePage(symbol, parent) {
  try {
    profileData = await getProfileData(symbol);

    //Data deconstruction
    /*When i passed elementsTo compose without initializing the deconstruct to a, 
    i recieved a "website not found" error. 
    After adding 'let a =' it worked. WHY????
    I'd like to think that initializing a gives it its own
    place in the memory and therefore refering it in the 
    info function does not get out of its scope.*/
    let {
      image,
      companyName,
      industry,
      price,
      changesPercentage,
      description,
      website,
    } = profileData.profile;

    document.title = `@${companyName}`;

    elementsToCompose = [
      {
        type: "a",
        classList: "flex",
        href: website,
        value: `<img class='profImg' src='${image}'></img> <h4>${companyName} (${industry})</h4>`,
      },
      {
        type: "h5",
        classList: "flex",
        value: `Stock price: $${price} ${setGoodBad(changesPercentage)}`,
      },
      { type: "p", classList: "flex", value: description },
    ];
  } catch {
    parent.innerHTML = "<h1>PAGE NOT FOUND :'<</h1>";
  }
  //Iterate through
  setProfileInfo(elementsToCompose, parent);
  let historicalData = await getHistoryData(profileData.symbol); //Get historical data
  setProfileGraph(historicalData); //set historical graph
}

async function setProfileInfo(elementsToCompose, parent) {
  elementsToCompose = await elementsToCompose;

  for (const elemType of elementsToCompose) {
    const domElement = document.createElement(elemType.type); //Create dom element of type element.type
    domElement.classList.add(elemType.classList); //Add classes to dom element

    if (elemType.href) {
      //If element has an href, add it. If not, pass.
      domElement.setAttribute("href", elemType.href);
    }

    updateResultInDom(domElement, elemType.value); //Update dom elements inner HTML
    parent.append(domElement); // Append dom element to its parent element
    toggleExpansion(10); //expand container
  }
}
///#####</profile page main logic>#####

//Page setup
const profileElement = grabElement("companyInfo");
const symbol = getQueryStringParams("symbol");
toggleVisibility(document.getElementById("spinner"), true);
setProfilePage(symbol, profileElement);
setMarquee();

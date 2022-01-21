const CONFIG = {
  APIServer:
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/",
  seachAppendix: {
    s: "search?query=",
    a: "&amp;&limit=12&amp;exchange=NASDAQ", //dropped to 9 because of request
  },
  companyLinks: `./html/company.html?symbol=`,
  profileEndpoint: `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/`,
  historyEndpoint: `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/`,
  marqueeEndpoint: `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nyse`,
  SEPERATOR: document.createElement("hr"),
  ERROR_ELEMENT: (document.createElement("span").innerHTML =
    "PAGE NOT FOUND :'<"),
};

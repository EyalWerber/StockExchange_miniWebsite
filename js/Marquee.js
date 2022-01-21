class Marquee {
  constructor(domElement) {
    this.element = domElement;
  }
  async load() {
    const data = await this.getData();
    this.makeMarqueeElement(data.slice(-50));
  }
  makeMarqueeElement(data) {
    const marqueeSpan = document.createElement("span");
    marqueeSpan.classList.add("marqueeText");
    for (let stock of data)
      marqueeSpan.innerHTML += `${stock.symbol} -${setGoodBad(
        stock.change,
        stock.price
      )}|`;

    this.element.append(marqueeSpan);
  }
  async getData() {
    const response = await getServerResponse("", "marquee");
    let data = await response.json();
    return data;
  }
}

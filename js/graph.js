const ctx = document.getElementById("hisoryGraph").getContext("2d");

// let data = getHistoryData(symbol).then((response) => console.log(response));
async function setProfileGraph(data) {
  data = await data;

  toggleVisibility(document.getElementById("spinner"), false);
  const myChart = new Chart(ctx, {
    type: "line",

    data: {
      labels: data[1],
      datasets: [
        {
          fill: true,
          label: "Stock Price History $",
          data: data[0],
          backgroundColor: ["rgba(255, 99, 132, .7)"],
          hoverBackgroundColor: ["rgba(255, 99, 132, 1)"],
          borderColor: ["rgba(255, 99, 132, 0)"],
          hoverBorderColor: ["rgba(255, 99, 132, 1)"],
          borderWidth: 50,
          pointRadius: 1.5,
        },
      ],
    },
    options: {
      hover: {
        mode: "point",
      },
      scales: {
        y: {
          ticks: {
            callback: function (value, index, values) {
              return value + "$";
            },
            stepSize: 5,
          },
        },
        x: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
      },
    },
  });
}

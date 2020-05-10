import GAME from '../../games/game1'

// Amount of filled per player
let data1 = Array.from(new Set(
  GAME.players.map(player =>
    (player && player.length) ? player.length : 0
  ))).sort((a, b) => a - b);

// Amount of owned per player
let data2 = Array.from(new Set(
  GAME.players.map(player =>
    (player && player.length) ? Array.from(new Set(player)).length : 0
  ))).sort((a, b) => a - b);

const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 65
};

let width = 1000 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

let x = d3.scaleBand().padding(0.2)
  .range([0, width])
  .domain(data1.map((d, i) => i));

let y = d3.scaleLinear()
  .range([height, 0])
  .domain([0, d3.max(data1)]);

let svg = d3.select("#dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// svg.selectAll(".bar")
//   .data(data1).enter()
//   .append("rect").attr("class", "bar").attr("fill", "green")
//   .attr("x", d => x(data1.indexOf(d)))
//   .attr("y", d => y(d))
//   .attr("width", x.bandwidth())
//   .attr("height", d => height - y(d));

let g = svg.selectAll(".rect")
  .data(data1)
  .enter()
  .append("g")
  .classed('rect', true);

const drawBars = () => {

  g.append("rect")
    .attr("width", x.bandwidth())
    .attr("height", (d, i) => height - y(data2[i]))
    .attr("x", (d, i) => x(1 + i))
    .attr("y", (d, i) => y(data2[i]))
    .attr("fill", "blue");

  g.append("rect")
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d))
    .attr("x", (d, i) => x(i))
    .attr("y", d => y(d))
    .attr("fill", "red")
    .attr("opacity", 0.5);


  // svg.append("g")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(d3.axisBottom(x));

  svg.append("g")
    .style("font-size", "18px")
    .call(d3.axisLeft(y));

  let len = GAME.colors.length;
  let med = new Array(3);
  let accumulators = new Array(med.length).fill(0);

  accumulators.forEach((acc, i) => {
    data1.forEach((player, j) => {
      if (acc < len / Math.pow(2, i + 1)) acc += player;
      else if (!med[i]) med[i] = j;
    });
    drawLine("H", x(med[i]), "blue");
  })

  let medianPlayer = data1[Math.round(data1.length / 2)];
  drawLine("V", y(medianPlayer), "green");

  let averageCells = Math.round(data1.reduce((prev, cur) => cur += prev) / data1.length);
  drawLine("V", y(averageCells), "red");

}

function drawLine(dir, val, color) {
  svg.append("line")
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", "1px")
    .attr("x1", dir == "V" ? 0 : val)
    .attr("y1", dir == "V" ? val : 0)
    .attr("x2", dir == "V" ? width : val)
    .attr("y2", dir == "V" ? val : height);
}

export default drawBars;

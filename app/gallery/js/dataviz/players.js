import GAME from '../../games/game1'

// Amount of owned per player
let data = Array.from(new Set(
  GAME.players.map(player =>
    (player && player.length) ? Array.from(new Set(player)).length : 0
  ))).sort((a, b) => a - b);

const margin = {
  top: 60,
  right: 20,
  bottom: 30,
  left: 65
};

let width = 700 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

let x = d3.scaleBand()
// .padding(0.2)
  .range([0, width])
  .domain(data.map((d, i) => i));

let y = d3.scaleLinear()
  .range([height, 0])
  .domain([0, d3.max(data)]);

let svg = d3.select("#dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let g = svg.selectAll(".rect")
  .data(data)
  .enter()
  .append("g")
  .classed('rect', true);

g.append("rect")
  .attr("width", x.bandwidth())
  .attr("height", (d, i) => height - y(data[i]))
  .attr("x", (d, i) => x(i))
  .attr("y", (d, i) => y(data[i]))
  .attr("fill", "blue")
  .attr('stroke', 'white');

svg.append("g")
  .style("font-size", "18px")
  .call(d3.axisLeft(y));

let len = GAME.colors.length;
let med = new Array(3);
let accumulators = new Array(med.length).fill(0);

accumulators.forEach((acc, i) => {
  data.forEach((player, j) => {
    if (acc < len / Math.pow(2, i + 1)) acc += player;
    else if (!med[i]) med[i] = j;
  });
  drawLine("H", x(med[i]), "blue");
})

let medianPlayer = data[Math.round(data.length / 2)];
drawLine("V", y(medianPlayer), "green");

let averageCells = Math.round(data.reduce((prev, cur) => cur += prev) / data.length);
drawLine("V", y(averageCells), "red");

// }

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

// export default drawBars;

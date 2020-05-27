import CELL from '../utils/cell'
import * as d3 from 'd3';

const margin = {
  top: 0,
  right: 0,
  bottom: 10,
  left: 20
};

const globalSize = {
  width: 250,
  height: 250
}

const width = globalSize.width - margin.left - margin.right;
const height = globalSize.height - margin.top - margin.bottom;

const percentage = (owned, APP) =>
  Math.round(owned * 1000 / (APP.rows * APP.cols)) / 10;


const insights = document.getElementById('insights');

const insert = {
  bottomPlayers: document.getElementById('blueplayers'),
  topPlayers: document.getElementById('darkblueplayers'),
  name: document.getElementById('playerName'),
  poors: document.getElementById('poors'),
  lowPercentage: document.getElementById('lowPercentage'),
  mediumPercentage: document.getElementById('mediumPercentage'),
  highPercentage: document.getElementById('highPercentage'),
  id: document.getElementById('playerId'),
  owned: document.getElementById('playerOwn'),
  percentage: document.getElementById('percentage'),
  distance: document.getElementById('distance'),
  delay: document.getElementById('delay')
}

const prev = document.getElementById('prev');
const next = document.getElementById('next');
const explore = document.getElementById('explore');

const drawBars = APP => {

  const data = APP.players.sort((a, b) => (a.owned.length - b.owned.length));

  let med, len = 0,
    mediumLen = 0,
    highLen = 0,
    acc = 0;

  data.forEach(player => len += player.owned.length);
  const half = len / 2;

  data.forEach((player, i) => {
    if (acc < half) acc += player.owned.length;
    else if (!med) med = i - 1;
  });

  const data1 = data.filter((e, i) => i < med).map(e => e.owned.length);
  const data2 = data.filter((e, i) => i >= med).map(e => e.owned.length);
  const medianPlayer = data[Math.round(data.length / 2)].owned.length;

  data1.forEach(player => mediumLen += player);
  data2.forEach(player => highLen += player);

  drawData(data1, data2.length, medianPlayer);
  drawData(data2, data1.length, medianPlayer);
  barOnclick(APP);

  insert.bottomPlayers.innerHTML = data1.length;
  insert.topPlayers.innerHTML = data2.length;
  insert.poors.innerHTML = APP.poorPlayers;
  insert.lowPercentage.innerHTML = percentage(APP.rows * APP.cols - len, APP);
  insert.mediumPercentage.innerHTML = percentage(mediumLen, APP);
  insert.highPercentage.innerHTML = percentage(highLen, APP);

  prev.addEventListener("click", () => {
    focusBar(APP, (data.length + APP.activeTarget - 1) % data.length);
  });

  next.addEventListener("click", () => {
    focusBar(APP, (APP.activeTarget + 1) % data.length);
  });

  explore.addEventListener("click", () => {
    explore.style.display = "none";
    focusBar(APP, data.length - 1);
  })

}

const drawData = (data, len, medianPlayer) => {
  const ratio = data.length / (data.length + len);
  const first = (ratio > 0.5);
  const targetMargin = margin.left += first ? 0 : 5;
  const targetWidth = first ? width * 0.8 : width * 0.1;
  const axisScale = first ? 1 : 0.9;
  const dcolor = first ? "blue" : "darkblue";
  const yAxis = first ? "yAxis1" : "yAxis2";
  const xShift = first ? 0 : targetWidth;

  const x = d3.scaleBand().padding(0.05)
    .range([0, targetWidth])
    .domain(data.map((d, i) => i));

  const y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data)]);

  const svg = d3.select("#bars")
    .append("svg")
    .attr("width", targetWidth + targetMargin + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + targetMargin + "," + margin.top + ")");

  const g = svg.selectAll(".rect")
    .data(data)
    .enter()
    .append("g")
    .classed('rect', true);
  g.append("rect")
    .attr("id", (d, i) => first ? i : (len + i))
    .attr("width", x.bandwidth())
    .attr("height", (d, i) => height - y(data[i]))
    .attr("x", (d, i) => x(i) - xShift)
    .attr("y", (d, i) => y(data[i]))
    .attr("fill", dcolor);

  svg.append("g")
    .style("font-size", "7px")
    .call(first ? d3.axisLeft(y) : d3.axisRight(y))
    .attr("id", yAxis)
    .attr("transform", "scale(" + axisScale + ", 1)");

  svg.append("circle")
    .attr("id", first ? "dot1" : "dot2")
    .attr("cx", 0)
    .attr("cy", y(medianPlayer))
    .attr("fill", "red")
    .attr("r", 2);

  const lineWidth = first ? width : -width;

  svg.append("line")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", "1px")
    .attr("x1", 4)
    .attr("y1", y(medianPlayer))
    .attr("x2", lineWidth)
    .attr("y2", y(medianPlayer));


  if (ratio < 0.5) return;

  svg.append("text")
    .attr("id", "ylabel")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".005em")
    .text("cases coloriées");
}

const barOnclick = (APP) => d3.select("#bars").on("click", () => {
  const target = d3.select(d3.event.target)._groups[0][0].id;
  if (target) focusBar(APP, target);
});

const focusBar = (APP, target) => {

  explore.style.display = "none";
  if (APP.activeTarget) document.getElementById(APP.activeTarget).style.opacity = "0.6";
  document.getElementById(target).style.opacity = "1";

  APP.activeTarget = parseInt(target);
  if (insights.style.display !== "block") insights.style.display = "block";
  const player = APP.players[target];
  if (!player) return;

  APP.canvas2.style.display = "block";
  APP.ctx2.fillStyle = "#f2f2f2";
  APP.ctx2.fillRect(0, 0, APP.canvas.width, APP.canvas.height)
  player.owned.forEach(e => CELL.clear(e, APP, APP.ctx2));

  insert.name.innerHTML = player.name;
  insert.id.innerHTML = APP.players.length - target;
  insert.owned.innerHTML = player.owned.length;
  insert.percentage.innerHTML = percentage(player.owned.length, APP)
  insert.distance.innerHTML = Math.round(player.owned.length * 0.4);
  insert.delay.innerHTML = Math.round(player.owned.length * 0.08);
}


export default drawBars;

// const drawLines = (svg, x, y) => {
//   const len = GAME.colors.length;
//   const med = new Array(3);
//   const accumulators = new Array(med.length).fill(0);
//
//   accumulators.forEach((acc, i) => {
//     data.forEach((player, j) => {
//       if (acc < len / Math.pow(2, i + 1)) acc += player;
//       else if (!med[i]) med[i] = j;
//     });
//     drawLine(svg, "H", x(med[i]), "blue");
//   })
//
//   const medianPlayer = data[Math.round(data.length / 2)];
//   drawLine(svg, "V", y(medianPlayer), "green");
//
//   const averageCells = Math.round(data.reduce((prev, cur) => cur += prev) / data.length);
//   drawLine(svg, "V", y(averageCells), "red");
// }
//
function drawLine(svg, dir, val, color) {
  svg.append("line")
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", "1px")
    .attr("x1", dir == "V" ? 0 : val)
    .attr("y1", dir == "V" ? val : 0)
    .attr("x2", dir == "V" ? width : val)
    .attr("y2", dir == "V" ? val : height);
}

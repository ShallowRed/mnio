import CELL from '../utils/cell'
import * as d3 from 'd3';

const explore = document.getElementById('explore');

const drawBars = APP => {

  const data = sortPlayers(APP.players);
  const totalCells = getTotal(data);
  const median = getMedian(totalCells, data);
  const medianPlayer = getMedianPlayer(data);
  const data1 = rankPlayers(data, median, "bottom");
  const data2 = rankPlayers(data, median, "top");

  drawData(data1, data2.length, medianPlayer);
  drawData(data2, data1.length, medianPlayer);
  click.init(APP, data);

  setAndInsertInsights(APP, data1, data2, totalCells);
  // splitPlayers(data, totalCells, 3);
};

const splitPlayers = (data, totalCells, nOfGroups) => {

  const newData = new Array(nOfGroups);
  const chunk = Math.floor(totalCells / nOfGroups);
  console.log("chunk: " + chunk);
  let indexAcc = 0;

  for (let i = 0; i < nOfGroups; i++) {
    const start = indexAcc;
    newData[i] = playersPerChunk(data, chunk, start);
    indexAcc += newData[i].length
  }

  console.log(newData);

  newData.forEach(item => {
    let accu = 0
    item.forEach(e => {
      accu += e.owned.length;
    });
    console.log(accu);
  });

}

const playersPerChunk = (data, chunk, start) => {
  let accumulator = 0;
  let stop;
  data.filter((e, i) => i >= start)
    .forEach((player, i) => {
      if (accumulator < chunk) {
        accumulator += player.owned.length;
      } else if (!stop) {
        stop = start + i - 1
      }
    });
  const group = data.slice(start, stop);
  console.table(group);
  return group;
};

const sortPlayers = players =>
  players.sort((a, b) => (a.owned.length - b.owned.length));

const getMedianPlayer = players =>
  players[Math.floor(players.length / 2)].owned.length;

const rankPlayers = (data, median, type) =>
  type == "top" ?
  data.filter((e, i) => i >= median).map(e => e.owned.length) :
  data.filter((e, i) => i < median).map(e => e.owned.length)

const getTotal = data => {
  let length = 0;
  data.forEach(player => length += player.owned.length);
  return length;
}

const getMedian = (totalCells, data) => {
  let accumulator = 0;
  let median;
  data.forEach((player, i) => {
    if (accumulator < totalCells / 2) accumulator += player.owned.length;
    else if (!median) median = i - 1;
  });
  return median;
};

const margin = {
  top: 0,
  right: 0,
  bottom: 10,
  left: 20
};

const width = 250 - margin.left - margin.right;
const height = 250 - margin.top - margin.bottom;

const drawData = (data, len, medianPlayer) => {

  const ratio = data.length / (data.length + len);
  const first = (ratio > 0.5);

  const targetMargin = margin.left += first ? 0 : 5;
  const targetWidth = first ? width * 0.8 : width * 0.1;
  const axisScale = first ? 1 : 0.9;
  const dcolor = first ? "blue" : "darkblue";
  const yAxis = first ? "yAxis1" : "yAxis2";
  const xShift = first ? 0 : targetWidth;
  const lineWidth = first ? width : -width;

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

const setAndInsertInsights = (APP, data1, data2, totalCells) => {

  const bottomPlayers = document.getElementById('blueplayers');
  const topPlayers = document.getElementById('darkblueplayers');
  const poors = document.getElementById('poors');
  const lowPercentage = document.getElementById('lowPercentage');
  const mediumPercentage = document.getElementById('mediumPercentage');
  const highPercentage = document.getElementById('highPercentage');

  bottomPlayers.innerHTML = data1.length;
  topPlayers.innerHTML = data2.length;
  poors.innerHTML = APP.poorPlayers;
  lowPercentage.innerHTML = percentage(APP.rows * APP.cols - totalCells, APP);

  let mediumLen = 0;
  data1.forEach(player => mediumLen += player);
  mediumPercentage.innerHTML = percentage(mediumLen, APP);

  let highLen = 0;
  data2.forEach(player => highLen += player);
  highPercentage.innerHTML = percentage(highLen, APP);
};

const percentage = (owned, APP) =>
  Math.round(owned * 1000 / (APP.rows * APP.cols)) / 10;

const click = {

  init: (APP, data) => {
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    const prevTarget = () => (data.length + APP.activeBar - 1) % data.length;
    const nextTarget = () => (APP.activeBar + 1) % data.length;

    const maxTarget = data.length - 1;

    prev.addEventListener("click", () => click.focusBar(APP, prevTarget()));
    next.addEventListener("click", () => click.focusBar(APP, nextTarget()));
    explore.addEventListener("click", () => {
      explore.style.display = "none";
      click.focusBar(APP, maxTarget);
    })

    click.barListenEvent(APP);
  },

  barListenEvent: APP => d3.select("#bars")
    .on("click", () => {
      const target = d3.select(d3.event.target)._groups[0][0].id;
      if (target) click.focusBar(APP, target);
    }),

  focusBar: (APP, target) => {
    target = parseInt(target, 10);
    const insights = document.getElementById('insights');
    const activeBar = document.getElementById(APP.activeBar);
    const targetBar = document.getElementById(target);
    explore.style.display = "none";
    targetBar.style.opacity = "1";
    if (APP.activeBar) activeBar.style.opacity = "0.6";

    APP.activeBar = target;
    if (insights.style.display !== "block") insights.style.display = "block";

    const player = APP.players[target];
    if (!player) return;

    APP.canvas2.style.display = "block";
    APP.ctx2.fillStyle = "#f2f2f2";
    APP.ctx2.fillRect(0, 0, APP.canvas.width, APP.canvas.height)
    player.owned.forEach(e => CELL.clear(e, APP, APP.ctx2));

    insertPlayerInsights(APP, player, target);
  }
}

const insertPlayerInsights = (APP, player, target) => {
  const name = document.getElementById('playerName');
  const id = document.getElementById('playerId');
  const owned = document.getElementById('playerOwn');
  const percents = document.getElementById('percentage');
  const distance = document.getElementById('distance');
  const delay = document.getElementById('delay');

  name.innerHTML = player.name;
  id.innerHTML = APP.players.length - target;
  owned.innerHTML = player.owned.length;
  percents.innerHTML = percentage(player.owned.length, APP)
  distance.innerHTML = Math.round(player.owned.length * 0.4);
  delay.innerHTML = Math.round(player.owned.length * 0.08);
}

export default drawBars;

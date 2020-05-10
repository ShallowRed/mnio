import GAME from '../../games/game1';
import sortedByHue from '../models/hue';

let width = 1000;
let height = 1000;
let margin = 40;
let radius = Math.min(width, height) / 2 - margin;
let data = sortedByHue(GAME);

let svg = d3.select("#dataviz")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

const drawDonut = sorted => {

  let pie = d3.pie().value(d => d.value);
  if (!sorted) pie.sort(null);
  let data_ready = pie(d3.entries(data.map(d => d.amount)));

  svg.selectAll('whatever')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', d3.arc()
      .innerRadius(300)
      .outerRadius(radius)
    )
    .attr("stroke", "white")
    .style("stroke-width", "1px")
    .attr('fill', d => data[d.data.key].color)
}

export default drawDonut;

import sortedByHue from '../utils/hue';
import * as d3 from 'd3';

let width = 250;
let height = 250;
const margin = 0;
const radius = Math.min(width, height) / 2 - margin;

const svg = d3.select("#graphs")
  .append("svg")
  .attr("id", "donut")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

const drawDonut = (APP, sorted) => {
  
  const data = sortedByHue(APP);

  const pie = d3.pie().value(d => d.value);
  if (!sorted) pie.sort(null);
  const data_ready = pie(d3.entries(data.map(d => d.amount)));

  svg.selectAll('whatever')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', d3.arc()
      .innerRadius(75)
      .outerRadius(radius)
    )
    .attr('fill', d => data[d.data.key].color);

}


export default drawDonut;

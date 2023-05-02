var width = 720,
    height = 720,
    outerRadius = Math.min(width, height) / 2 - 10,
    innerRadius = outerRadius - 24;

var formatPercent = d3.format(".1%");

var chord_layout = d3.chord()
    .padAngle(0.01)
    .sortSubgroups(d3.descending)
    .sortGroups(d3.descending);

var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

var path = d3.ribbon()
    .radius(innerRadius);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("id", "circle")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.append("circle")
    .attr("r", outerRadius);

d3.queue()
    .defer(d3.json, "./data/pokemons.json")
    .await(ready);

function ready(error, data) {
  if (error) throw error;

  var matrix = data.valuesData;
  var cities = data.entities;
  var extended_info = data.extended_entities;

  var chord = chord_layout(matrix);

  var colorScale = d3.scaleOrdinal(d3.schemeCategory20b);

  // AÃ±adimos una grupo por cada aeropuerto.
  var group = svg.selectAll(".group")
      .data(chord.groups)
    .enter().append("g")
      .attr("class", "group")
      .on("mouseover", mouseover);

  // AÃ±adimos un campo title que se mostrarÃ¡ automaticamente en el mouseover.
  group.append("title").text(function(d, i) {
    return extended_info[cities[i]].long + ": " + d.value + " routes";
  });

  // Dibujamos cada grupo como un arco.
  var groupPath = group.append("path")
      .attr("id", function(d, i) { return "group" + i; })
      .attr("d", arc)
      .style("fill", function(d, i) { return colorScale(i); });

  // Y a cada arco le aÃ±adimos un nombre.
  var groupText = group.append("text")
      .attr("x", 6)
      .attr("dy", 15);

  groupText.append("textPath")
      .attr("xlink:href", function(d, i) { return "#group" + i; })
      .text(function(d, i) { return extended_info[cities[i]].short; });

  // Para cada par de valores ciudad1-ciudad2 y ciudad2-ciudad1 se dibuja una cuerda
  var chord = svg.selectAll(".chord")
      .data(chord)
    .enter().append("path")
      .attr("class", "chord")
      .style("fill", function(d, i) { return colorScale(d.target.index); })
      .attr("d", path);

  // AÃ±adimos un campo title como en el caso de los arcos pero algo mÃ¡s detallado
  chord.append("title").text(function(d) {
    return extended_info[cities[d.source.index]].long
        + " â†’ " + extended_info[cities[d.target.index]].long
        + ": " + d.source.value
        + "\n" + extended_info[cities[d.target.index]].long
        + " â†’ " + extended_info[cities[d.source.index]].long
        + ": " + d.target.value;
  });

  function mouseover(d, i) {
    chord.classed("fade", function(p) {
      return p.source.index != i
          && p.target.index != i;
    });
  }
}
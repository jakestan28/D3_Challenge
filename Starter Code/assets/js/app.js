// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(stateData) {
    console.log(stateData)

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare=+data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d.poverty)-2, d3.max(stateData, d => d.poverty)+2])
      .range([0, width]);
      console.log(xLinearScale);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d.healthcare)-2, d3.max(stateData, d => d.healthcare)+2])
      .range([height, 0]);
      console.log(`Poverty Min: ${d3.min(stateData, d => d.poverty)}`);
      console.log(`Poverty Max: ${d3.max(stateData, d => d.poverty)}`);
      console.log(`Healthcare Min: ${d3.min(stateData, d => d.healthcare)}`);
      console.log(`Healthcare Max: ${d3.max(stateData, d => d.healthcare)}`);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

     // // Step 5: Create Circles
    // // ==============================
    var circlesGroup = chartGroup
    .selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xLinearScale(d.poverty) } )
    .attr("cy", function (d) { return yLinearScale(d.healthcare) } )
    .attr("r", 10)
    .attr("class", "stateCircle");
    
     // // Step 6: Create Sate Text
    // // ==============================
    chartGroup
    .selectAll("states")
    .data(stateData)
    .enter()
    .append("text").text(function(d){return d.abbr})
    .attr("x", function (d) { return xLinearScale(d.poverty) } )
    .attr("y", function (d) { return yLinearScale(d.healthcare) + 5 } )
    .attr("class", "stateText");


    // Step 7: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Hits: ${d.healthcare}`)
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    circlesGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Healthcare");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty");
  })
  .catch(function(error) {
    console.log(error);
  });
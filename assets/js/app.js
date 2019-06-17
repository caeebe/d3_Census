// @TODO: YOUR CODE HERE!

// data file:
// id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh,-0.385218228

// html location id:
// <div id="scatter"> <!-- We append our chart here. --> </div>

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
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("class", "chart");

// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {
    
    // Cast Data as numbers
    // ==============================
    censusData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.income = +data.income;
        data.age = +data.age;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.poverty = +data.poverty;
        data.abbr = String(data.abbr);
    });
    
    // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.income) - 1000, d3.max(censusData, d => d.income)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.smokes) - 2, d3.max(censusData, d => d.smokes)])
      .range([height, 0]);

    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
    
        // Add ToolTips
    // ==============================
    var toolTip = d3.tip()
        .html(function(d) { 
            return `${d.state}<br/>Income: $${d.income}<br/>Smokers: ${d.smokes}%`; })
        .attr("class", "d3-tip");
    chartGroup.call(toolTip);

    // Create Circles
    // ==============================
    var radius = "10px"
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", radius)
    .on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);
    
    
    // Add Text to the circles
    // ==============================
    var textGroup = chartGroup.selectAll(null)
        .data(censusData)
        .enter()
        .append("text")
        .attr("class", "stateText")
        .attr("x", d => xLinearScale(d.income))
        .attr("y", d => yLinearScale(d.smokes) + 2)
        .attr("font-size", radius)
        .text((d) => d.abbr);
    
    
    // Create axes labels
    chartGroup.append("text")
        .attr("class", "aText")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .text("% Smoking");

    chartGroup.append("text")
      .attr("transform", `translate(${(width / 2)}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("Median Household Income");
    
    console.log(censusData);

  });


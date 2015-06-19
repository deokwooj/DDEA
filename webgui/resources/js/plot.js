function drawAxes (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {

  var legendWidth  = 200,
      legendHeight = 100;

  var axes = svg.append('g')
    .attr('clip-path', 'url(#axes-clip)');

	axes.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate('+ margin.left + ',' + chartHeight + ')')
		.call(xAxis);

  axes
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate('+ margin.left + ', 0)')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Value');
}

function plotPreproc (svg, data, x, y){

  var diffLine = d3.svg.line().x(function (d) { return x(d.ts); }).y(function (d) { return y(d.diff); });
  var avgLine =  d3.svg.line().x(function (d) { return x(d.ts); }).y(function (d) { return y(d.avg); });

  svg.datum(data);

  svg.append('path')
    .attr('class', 'diff')
    .attr('d', diffLine)
    .attr('clip-path', 'url(#rect-clip)');

  svg.append('path')
    .attr('class', 'median-line')
    .attr('d', avgLine)
    .attr('clip-path', 'url(#rect-clip)');
}

function drawPreproc (titleid, svgid, title, data) {

    $(titleid).text(title);

    var svg = $(svgid);
    while (svg.lastChild) {
      svg.removeChild(svg.lastChild);
    }
    svg.empty();

    svg = d3.select(svgid);

    var dimen = svg.node().getBoundingClientRect();

    var svgWidth  = dimen["width"],
        svgHeight = dimen["height"];

    var margin = { top: 20, right: 2, bottom: 30, left: 40 },
        chartWidth  = svgWidth  - margin.left - margin.right,
        chartHeight = svgHeight - margin.top  - margin.bottom;

    var x = d3.time.scale().range([0, chartWidth])
    		      .domain(d3.extent(data, function (d) { return d.ts; })),

        y = d3.scale.linear()
            .range([chartHeight, 0])
        	  .domain([ d3.min(data, function (d) { return Math.min(d.avg, d.diff); }), 
                      d3.max(data, function (d) { return Math.max(d.avg, d.diff); }) ]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom').innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
        yAxis = d3.svg.axis().scale(y).orient('left').innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

    svg
    //.attr('width',  svgWidth).attr('height', svgHeight)
    .append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // clipping to start chart hidden and slide it in later
    var rectClip = svg.append('clipPath')
                    .attr('id', 'rect-clip')
                    .append('rect')
                    .attr('x', margin.left)	
                    .attr('width', chartWidth)
                    .attr('height', chartHeight);

    drawAxes(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
    plotPreproc(svg, data, x, y);
}











function heatmap(json_url, svg_id, colorCalibration)
{
    d3.json(json_url, function(err,data){

        //UI configuration
        var itemSize = 9,
            cellSize = itemSize-0.5;
            margin = {top:20,right:20,bottom:20,left:25};

        //data vars for rendering


        var svg = d3.select('[role="'+ svg_id + '"]');

        var sensor_state = data['sensor-state'];

        // all states have same length of elements
        var state_elem_length = sensor_state[0].length;
        var states_count = sensor_state.length;

        svg
            .style("height", itemSize * states_count);
/*
        svg
            .append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", '#f00');
*/

        // rect drawing code
        svg
            .selectAll("g")
            .data(sensor_state)
            .enter()
            .append("g")

            .selectAll("rect")
            .data(function(d,i,j) { return d; })
            .enter()
            .append("rect")

            .attr('width',cellSize)
            .attr('height',cellSize)
            .attr('x',function(d,i,j){
                return i * itemSize;
            })
            .attr('y',function(d,i,j){
                return j * itemSize;
            })
            .attr('fill',function(d,i,j){

                //choose color dynamicly
                var colorIndex = d3.scale
                    .quantize()
                    .range([0,1,2])
                    .domain([-1,1]);

                return colorCalibration[colorIndex(d)]
            });


        //render axises
        xAxis
            .scale(xAxisScale.range([0,axisWidth])
            .domain([dateExtent[0],dateExtent[1]]));

        svg.append('g')
            .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
            .attr('class','x axis')
            .call(xAxis)
            .append('text')
            .text('date')
            .attr('transform','translate(' + axisWidth + ',-10)');

        svg.append('g')
            .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
            .attr('class','y axis')
            .call(yAxis)
            .append('text')
            .text('time')
            .attr('transform','translate(-10,' + axisHeight + ') rotate(-90)');
    });
}
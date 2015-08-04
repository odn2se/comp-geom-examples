var svg = d3.select('svg#points-container');
var points = [];
console.log("Found svg", svg);

svg.on("click", function() {
    var x = d3.event.offsetX;
    var y = d3.event.offsetY;

    points.push(new Point(x, y));

    var join = svg.selectAll("circle").data(points);
    console.log(join);
    join.enter().append("circle");
    join.classed("point", true);
    join.attr("cx", function(d) {
        return d.x;
    }).attr("cy", function(d) {
        return d.y;
    }).attr("r", 3);

    var hull = grahamScan(points);
	hull.push(hull[0]);

    var lineGen = d3.svg.line().x(function(d) {
        return d.x;
    }).y(function(d) {
        return d.y;
    }).interpolate("linear");

    join = svg.selectAll("path.hull").data([0]);
	join.enter().append("path").classed("hull", true);
	join.attr("d", lineGen(hull))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");
});

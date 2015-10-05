module("Convex Hull Tests");

test("square", function () {
    var points = [];
    points.push(new Point(1, 1));
    points.push(new Point(-1, -1));
    points.push(new Point(-1, 1));
    points.push(new Point(1, -1));

    var hull = convexHull(points);
    equal(hull.length, 4);

    points.forEach(function (d) {
        ok(hull.indexOf(d) != -1);
    });
});

test("square with interior points", function () {
    var points = [];
    points.push(new Point(1, 1));
    points.push(new Point(-1, -1));
    points.push(new Point(-1, 1));
    points.push(new Point(1, -1));
    points.push(new Point(0, 0));

    var hull = convexHull(points);
    equal(hull.length, 4);

    ok(hull.indexOf(points[4]) === -1, "Interior point is not in hull");
});
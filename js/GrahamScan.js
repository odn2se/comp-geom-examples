/*
 * Compute the convex hull of an array of points using the Graham Scan procedure
 */
function grahamScan(points) {
    var hull = [];

    var minX = null;
    points.forEach(function(pt) {
        if (minX == null || minX.x > pt.x || (minX.x == pt.x && minX.y > pt.y)) minX = pt;
    });

    points.sort(function(pt1, pt2) {
        if (pt1.x == minX.x && pt1.y == minX.y)
            return -1;
        if (pt2.x == minX.x && pt2.y == minX.y)
            return 1;

        var ang1 = angle(minX, pt1);
        var ang2 = angle(minX, pt2);

        if (ang1 < ang2)
            return -1;
        else if (ang1 > ang2)
            return 1;
        else return 0;
    });

	console.log("MinX is ", minX);
    hull.push(minX);
    hull.push(points[1]);
	console.log("Hull beginning is ", hull);

	// TODO: Handle colinear points (particularly at the start of the method)
    for (var i = 2; i < points.length; i++) {
        while (cw(hull[hull.length - 2], hull[hull.length - 1], points[i]) <= 0) {
            hull.pop();
        }
		hull.push(points[i]);
    }

	return hull;
}

/*
 * Returns angle from p1 vertical (cw) to p2
 */
function angle(p1, p2) {
    var angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);

    angleRadians = Math.PI / 2 - angleRadians;

    return angleRadians;
}

/*
 *	Returns positive number if the points are CW, negative number if they are CCW
 */
function cw(p1, p2, p3) {
    return (p2.y - p1.y) * (p3.x - p1.x) - (p2.x - p1.x) * (p3.y - p1.y);
}

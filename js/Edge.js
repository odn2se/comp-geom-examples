
function Edge(halfEdge) {
    this.halfEdge = halfEdge;
    // Choose a canonical definition where the origin is the top vertex
    var pt1 = halfEdge.origin;
    var pt2 = halfEdge.twin.origin;
    this.origin = vertexComparator(pt1, pt2) < 0 ? pt1 : pt2;
    this.dest = vertexComparator(pt1, pt2) < 0 ? pt2 : pt1;
    this.slope = (this.dest.pt.y - this.origin.pt.y) / (this.dest.pt.x - this.origin.pt.x);
    this.intercept = this.dest.pt.y - this.dest.pt.x * this.slope;
}

Edge.prototype.x = function (pt) {
    if (this.origin.pt.x === this.dest.pt.x)
        return pt.y; // No slope
    else {
        var intercept = this.dest.pt.y - this.dest.pt.x * this.slope;

        return this.slope * pt.x + intercept;
    }
};

Edge.prototype.contains = function (vertex) {
    var pt = vertex.pt;
    var ret = false;
    if (comparePts(pt, this.origin.pt) === 0 || comparePts(pt, this.dest.pt) === 0)
        ret = true;
    else {
        if (this.origin.pt.x === this.dest.pt.x) {
            if (pt.x !== this.origin.pt.x)
                ret = false;

            ret = (pt.y > this.origin.pt.y && pt.y < this.dest.pt.y);
        } else {
            // use slope
            if (pt.y > this.origin.pt.y && pt.y < this.dest.pt.y) {
                var intercept = this.dest.pt.y - this.dest.pt.x * this.slope;
                ret = (pt.y === pt.x * this.slope + intercept);
            } else {
                ret = false;
            }
        }
    }

    console.info("Edge %o contains %o : %o", this, pt, ret);
    return ret;
};

Edge.prototype.containsX = function (x) {
    return x <= Math.max(this.origin.x, this.dest.x) && x >= Math.min(this.origin.x, this.dest.x);
};


Edge.prototype.containsY = function (y) {
    return y <= Math.max(this.origin.y, this.dest.y) && y >= Math.min(this.origin.y, this.dest.y);
};

Edge.prototype.toString = function () {
    return this.origin + "->" + this.dest;
};
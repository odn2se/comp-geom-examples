function LineSegment(pt1, pt2) {
    this.pt1 = pt1;
    this.pt2 = pt2;
    this.slope = (pt1.y - pt2.y) / (pt1.x - pt2.x);
    this.intercept = pt1.y - this.slope * pt1.x;
    if (pt1.y < pt2.y || (pt1.y == pt2.y && pt1.x < pt2.x)) {
        this.top = pt1;
        this.bottom = pt2;
    } else {
        this.top = pt2;
        this.bottom = pt1;
    }
    this.name = "S"
}

LineSegment.prototype.y = function (x) {
    return this.slope * x + this.intercept;
}

LineSegment.prototype.x = function (pt) {
    if (this.slope == 0)
        return Math.max(this.top.x, Math.min(pt.x, this.bottom.x));
    return (pt.y - this.intercept) / this.slope;
}

LineSegment.prototype.containsY = function (y) {
    return y >= this.top.y && y <= this.bottom.y;
}
/**
 * Created by phand on 10/4/15.
 */

var faceId = 0, vertexId = 0;

function ptComparator(pt1, pt2) {
    if (pt1.y < pt2.y)
        return -1;
    if (pt1.y > pt2.y)
        return 1;
    else {
        if (pt1.x < pt2.x)
            return -1;
        else if (pt1.x > pt2.x)
            return 1;
        else
            return 0;
    }
}

function vertexComparator(a, b) {
    return ptComparator(a.pt, b.pt);
}

function halfEdgeComparator(a, b) {
    var c1 = vertexComparator(a.origin, b.origin);
    if (c1 !== 0)
        return c1;
    else {
        var c2 = vertexComparator(a.twin.origin, b.twin.origin);
        return c2;
    }
}

function edgeComparator(a, b) {
    var c1 = vertexComparator(a.origin, b.origin);
    if (c1 !== 0)
        return c1;
    else {
        var c2 = vertexComparator(a.dest, b.dest);
        return c2;
    }
}

function DoublyConnectedEdgeList(outerPts, innerPts) {
    this.vertices = new BST(vertexComparator);
    this.faces = [];
    this.halfEdges = new BST(halfEdgeComparator);

    this.create(outerPts, innerPts);
}

function HalfEdge(origin, face, next, prev, twin) {
    this.origin = origin;
    this.twin = twin;
    this.incidentFace = face;
    this.next = next;
    this.prev = prev;
}

function Vertex(pt) {
    this.pt = pt;
    this.x = pt.x;
    this.y = pt.y;
    this.incidentEdge = null;
    this.name = "v" + (++vertexId);
}

Vertex.prototype.toString = function () {
    return this.name + "@" + this.pt;
};

function Face(outerComp, innerComp) {
    this.outerComponent = outerComp;
    this.innerComponents = [];
    this.name = "f" + (++faceId);
}

DoublyConnectedEdgeList.prototype.getNumFaces = function () {
    return this.faces.length;
};

DoublyConnectedEdgeList.prototype.getNumHalfEdges = function () {
    return this.halfEdges.size();
};

/*
 * outerPts is an array of pts in ccw order
 * innerPts is a two dimensional array for the holes, each in cw order
 */

DoublyConnectedEdgeList.prototype.create = function (outerPts, innerPts) {
    // Add all the points to the vertices array
    var that = this;
    this.vertices.insert(new Vertex(new Point(0, 0)));
    var vertices = outerPts.map(function (a) {
        return new Vertex(a);
    });
    vertices.forEach(function (v) {
        that.vertices.insert(v);
    });

    if (typeof innerPts !== 'undefined') {
        innerPts.forEach(function (arr) {
            arr.forEach(that.vertices.insert, that.vertices);
        });
    }

    var face = new Face();
    this.faces.push(face);
    var creationEdges = [];
    var i;
    for (i = 0; i < vertices.length; i++) {
        var origin = vertices[i];
        var dest = vertices[(i + 1) % vertices.length];

        var halfEdge = new HalfEdge(origin, face);
        creationEdges.push(halfEdge);

        if (i === 0) {
            face.outerComponent = halfEdge;
        }
    }

    for (i = 0; i < vertices.length; i++) {
        var edge = creationEdges[i];
        var next = creationEdges[(i + 1) % vertices.length];
        var prev = creationEdges[(vertices.length + i - 1) % vertices.length];

        edge.next = next;
        edge.prev = prev;

        var twin = new HalfEdge(next.origin, null, prev, next, edge);
        edge.twin = twin;

        this.halfEdges.insert(edge);
        this.halfEdges.insert(edge.twin);
    }

    return this;
};

DoublyConnectedEdgeList.prototype.merge = function (otherDCE) {
    var statusStructure = new BST();
    var eventQueue = new BST(eventCompare);

    var edges = new BST(edgeComparator);
    var addHE = function (he) {
        edges.insert(new Edge(he));
    };
    this.halfEdges.preOrder(addHE);
    otherDCE.halfEdges.preOrder(addHE);

    console.log("Added %d total edges", edges.size());

    edges.preOrder(function (edge) {
        eventQueue.insert(new SegmentStartEvent(edge.origin, edge), combineEvents);
        eventQueue.insert(new SegmentEndEvent(edge.dest, edge));
    });

    var deleteFn = function (d) {
        statusStructure.delete(d);
    };
    var insertFn = function (d) {
        statusStructure.insert(d);
    };

    while (!eventQueue.isEmpty()) {
        var event = eventQueue.findMin();
        console.info("Evaluating %o", event);

        var U = [], L = [], C = [];
        var pt = event.pt;

        if (event.type === 'SegmentStart') {
            if (statusStructure.compare === null)
                statusStructure.compare = compareEdgesAtSweep(pt);
            U = event.segments;
        }

        var statusPt = new StatusPoint(pt);
        var nextInStatus = statusStructure.findNext(statusPt);
        console.log("Next in status is ", nextInStatus);
        while (nextInStatus !== null && nextInStatus.contains(pt)) {
            if (comparePts(nextInStatus.dest.pt, pt) === 0)
                L.push(nextInStatus);
            else {
                C.push(nextInStatus);
            }
            nextInStatus = statusStructure.findNext(nextInStatus);
        }

        var prevInStatus = statusStructure.findPrev(statusPt);
        console.log("Prev in status is ", prevInStatus);
        while (prevInStatus !== null && prevInStatus.contains(pt)) {
            if (comparePts(prevInStatus.dest.pt, pt) === 0)
                L.push(prevInStatus);
            else {
                C.push(prevInStatus);
            }
            prevInStatus = statusStructure.findPrev(prevInStatus);
        }

        console.log("U=%o, L=%o, C=%", U, L, C);

        if (U.length + C.length + L.length > 1) {
            console.log("This is an intersection point");
        }

        // Remove L and C from the status structure. Reinsert C, U
        L.forEach(deleteFn);
        C.forEach(deleteFn);
        statusStructure.compare = compareEdgesAtSweep(pt);
        C.forEach(insertFn);
        U.forEach(insertFn);

        var sr, sl, intersection;
        if (C.length + U.length === 0) {
            sl = statusStructure.findPrev(statusPt);
            sr = statusStructure.findNext(statusPt);
            intersection = intersect(sl, sr, pt);
            if (intersection !== null)
                eventQueue.insert(new SegmentIntersection(intersection));
        } else {
            sl =
        }

        eventQueue.delete(event);
    }
};

function intersect(e1, e2, pt) {
    var ret = null;
    if (e1 === null || e2 === null)
        ret = null;
    else {
        if (e2.origin.x === e2.dest.x) {
            var tmp = e2;
            e2 = e1;
            e1 = tmp;
        }

        var x, y;
        if (e1.origin.x === e1.dest.x) {
            y = e2.intercept + e1.dest.x * e2.slope;

            if (y > pt.y && y < e1.dest.y)
                return new Point(el.origin.x, y);
        } else {
            x = (e2.intercept - e1.intercept) / (e2.slope - e1.slope);
            y = e1.slope * x + e1.intercept;

            if (e1.containsX(x) && e1.containsY(y) && e2.containsX(x) && e2.containsY(y) && (y > pt.y || (y === pt.y && x > pt.x))) {
                ret = new Point(x, y);
            }
        }
    }

    console.log("%o and %o intersect at %o ", e1, e2, ret);
    return null;
}

function StatusPoint(pt) {
    this.pt = pt;
    this.slope = 0;
    this.isStatusPt = true;
}

StatusPoint.prototype.x = function () {
    return this.pt.x;
};


function compareEdgesAtSweep(p) {
    return function (s1, s2) {
        if (s1 === s2)
            return 0;

        var s1x = s1.x(p);
        var s2x = s2.x(p);

        if (s1x < s2x)
            return -1;
        else if (s1x > s2x)
            return 1;
        else {
            if (s2.isStatusPt)
                return 1;
            if (s1.isStatusPt)
                return -1;

            if (s1.origin.x === s1.dest.x) {
                if (s2.slope > 0)
                    return 1;
                else
                    return -1;

            } else if (s2.origin.x === s2.dest.x) {
                if (s1.slope > 0)
                    return -1;
                else
                    return 1;
            }

            // Equal - compare their slopes to see who is on the left immediately BELOW the point
            if (s1.slope < 0 && s2.slope < 0) {
                if (s1.slope < s2.slope)
                    return 1;
                else
                    return 0;
            } else if (s2.slope < 0 && s1.slope >= 0) {
                return 1;
            } else if (s1.slope < 0 && s2.slope >= 0) {
                return -1;
            } else {
                if (s1.slope < s2.slope)
                    return 1;
                else
                    return -1;
            }
        }
    };
}


function combineEvents(existing, replace) {
    var ret = existing;
    if (existing.type === 'SegmentStart') {
        if (replace.type === 'SegmentStart') {
            existing.segments = existing.segments.concat(replace.segments);
            ret = existing;
        } else {
            ret = existing;
        }
    } else {
        if (replace.type === 'SegmentStart')
            ret = replace;
    }
    console.log("Combined events %o, %o to %o", existing, replace, ret);
    return ret;
}

function eventCompare(e1, e2) {
    return vertexComparator(e1.pt, e2.pt);
}